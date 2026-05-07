import { Gamemodes } from "@/utils/gamemodes";
import { useRef } from "react";

// const backendURL = "http://192.168.86.22:8000"; // Tony url
const backendURL = "http://192.168.56.1:8000"; // Zak url

interface RealTimeOptions {
  onTranscript?: (text: string, role: "user" | "assistant") => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onVolume?: (volume: number, source: "assistant" | "user") => void;
}

export const useRealTime = (options: RealTimeOptions = {}) => {
  const { onTranscript, onConnected, onDisconnected, onVolume } = options;

const pcRef           = useRef<RTCPeerConnection | null>(null);
const streamRef       = useRef<MediaStream | null>(null);
const audioElRef      = useRef<HTMLAudioElement | null>(null);
const audioCtxRef     = useRef<AudioContext | null>(null);
// Separate RAF handles so assistant and user polls don't clobber each other
const rafAssistantRef = useRef<number | null>(null);
const rafUserRef      = useRef<number | null>(null);


  const waitForIceGathering = (pc: RTCPeerConnection): Promise<void> => {
    return new Promise((resolve) => {
      if (pc.iceGatheringState === "complete") { resolve(); return; }
      const check = () => {
        if (pc.iceGatheringState === "complete") {
          pc.removeEventListener("icegatheringstatechange", check);
          resolve();
        }
      };
      pc.addEventListener("icegatheringstatechange", check);
    });
  };

  /**
   * Hooks up an AnalyserNode to a MediaStream and polls RMS volume on every
   * animation frame. Each source ("assistant" | "user") uses its own RAF handle
   * so they run independently and can be cancelled independently.
   */

  const startVolumePolling = (stream: MediaStream, source: "assistant" | "user") => {
    const ctx = audioCtxRef.current ?? new AudioContext();
    audioCtxRef.current = ctx;

    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6

    const src = ctx.createMediaStreamSource(stream);
    src.connect(analyser);

    const buffer = new Float32Array(analyser.fftSize);
    const rafRef = source === "assistant" ? rafAssistantRef : rafUserRef;

    const poll = () => {
      analyser.getFloatTimeDomainData(buffer);
      const rms = Math.sqrt(buffer.reduce((s, x) => s + x * x, 0) / buffer.length);
      const normalised = Math.min(rms * (source === "user" ? 3 : 6), 1);
      onVolume?.(normalised, source);
      rafRef.current = requestAnimationFrame(poll);
    };

    rafRef.current = requestAnimationFrame(poll);
  };

  const startSession = async ({
    gamemodeKey,
    language,
  }: {
    gamemodeKey: string;
    language: string;
  }) => {
    const res = await fetch(`${backendURL}/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        voice: Gamemodes[gamemodeKey].voice,
        instructions: `
Stay in character at all times.

LANGUAGE:
- Only speak in ${language}. Never use any other language.

RESPONSE FORMAT (STRICT):
- Exactly 2 sentences.
- Sentence 1: a short statement.
- Sentence 2: a simple question.
- Do not add anything else.

STYLE:
- Use simple vocabulary (high-school level).
- Keep sentences short and clear.

CONTEXT:
${Gamemodes[gamemodeKey].prompt}
`
      }),
    });
    const session = await res.json();
    const clientSecret = session?.client_secret?.value;
    if (!clientSecret) throw new Error("Missing client secret from backend");

    const RTCPeerConnectionImpl =
      window.RTCPeerConnection ||
      (window as any).webkitRTCPeerConnection ||
      (window as any).mozRTCPeerConnection;

    const pc: RTCPeerConnection = new RTCPeerConnectionImpl();
    pcRef.current = pc;

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") onConnected?.();
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        onDisconnected?.();
      }
    };

    pc.ontrack = (event: RTCTrackEvent) => {
      const audio = document.createElement("audio");
      audio.autoplay = true;
      audio.srcObject = event.streams[0];
      document.body.appendChild(audio);
      audioElRef.current = audio;

      // Poll assistant (incoming) audio volume
      startVolumePolling(event.streams[0], "assistant");
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Poll user (mic) audio volume
    startVolumePolling(stream, "user");

    const dc = pc.createDataChannel("oai-events");

    dc.onopen = () => {
      dc.send(
        JSON.stringify({
          type: "session.update",
          session: {
            turn_detection: {
              type: "server_vad",
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
            },
            input_audio_transcription: { model: "whisper-1" },
          },
        }),
      );

      dc.send(
        JSON.stringify({
          type: "response.create",
          response: {
            instructions:`
Stay in character at all times.

LANGUAGE:
- Only speak in ${language}. Never use any other language.

RESPONSE FORMAT (STRICT):
- Exactly 2 sentences.
- Sentence 1: a short statement.
- Sentence 2: a simple question.
- Do not add anything else.

STYLE:
- Use simple vocabulary (high-school level).
- Keep sentences short and clear.

CONTEXT:
${Gamemodes[gamemodeKey].prompt}
`,
          },
        }),
      );
    };

    dc.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      if (data.type === "response.audio_transcript.done") {
        onTranscript?.(data.transcript, "assistant");
      }

      if (data.type === "conversation.item.input_audio_transcription.completed") {
        onTranscript?.(data.transcript, "user");
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    await waitForIceGathering(pc);

    const response = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${clientSecret}`,
          "Content-Type": "application/sdp",
        },
        body: pc.localDescription!.sdp,
      },
    );

    if (!response.ok) {
      throw new Error(
        `OpenAI SDP error: ${response.status} ${await response.text()}`,
      );
    }

    const answerSDP = await response.text();
    await pc.setRemoteDescription({ type: "answer", sdp: answerSDP });
  };

  const stopSession = () => {
    // Cancel both polling loops independently
    if (rafAssistantRef.current !== null) {
      cancelAnimationFrame(rafAssistantRef.current);
      rafAssistantRef.current = null;
    }
    if (rafUserRef.current !== null) {
      cancelAnimationFrame(rafUserRef.current);
      rafUserRef.current = null;
    }

    audioCtxRef.current?.close();
    audioCtxRef.current = null;

    streamRef.current?.getTracks().forEach((t) => t.stop());
    pcRef.current?.close();
    audioElRef.current?.remove();
    pcRef.current = null;
    streamRef.current = null;
    audioElRef.current = null;
    onDisconnected?.();
  };

  return { startSession, stopSession };
};