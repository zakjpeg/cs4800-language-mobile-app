import { Gamemodes } from "@/utils/gamemodes";

const backendURL = "http://192.168.56.1:8000";

interface RealTimeOptions {
  onTranscript?: (text: string, role: "user" | "assistant") => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export const useRealTime = (options: RealTimeOptions = {}) => {
  const { onTranscript, onConnected, onDisconnected } = options;

  const pcRef = { current: null as RTCPeerConnection | null };
  const streamRef = { current: null as MediaStream | null };
  const audioElRef = { current: null as HTMLAudioElement | null };

  const waitForIceGathering = (pc: RTCPeerConnection): Promise<void> => {
    return new Promise((resolve) => {
      if (pc.iceGatheringState === "complete") {
        resolve();
        return;
      }
      const check = () => {
        if (pc.iceGatheringState === "complete") {
          pc.removeEventListener("icegatheringstatechange", check);
          resolve();
        }
      };
      pc.addEventListener("icegatheringstatechange", check);
    });
  };

  const startSession = async ({
    gamemodeKey,
    language,
  }: {
    gamemodeKey: string;
    language: string;
  }) => {
    const res = await fetch(`${backendURL}/session`);
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
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

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
            instructions: `LANGUAGE: ${language}; ${Gamemodes[`${gamemodeKey}`].prompt}.
            RULES: Every response should always be 2 brief sentences.
            Your objective through this roleplay is to practice ${language} with me. Always speak in ${language}, do not switch to another language under any circumstance.
            Always play your role. Under no circumstance should you break character or respond uncharacteristically to your role.
            You should always begin with a simple question, and then your following responses should include a simple, brief sentence before another question.
            Restrict your vocabulary to words, phrases, and concepts that high-school students can understand from their ${language} class course material.
            `,
          },
        }),
      );
    };

    dc.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);

      // Assistant transcript (what the NPC said)
      if (data.type === "response.audio_transcript.done") {
        onTranscript?.(data.transcript, "assistant");
      }

      // User transcript (what the user said, requires input_audio_transcription)
      if (
        data.type === "conversation.item.input_audio_transcription.completed"
      ) {
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
