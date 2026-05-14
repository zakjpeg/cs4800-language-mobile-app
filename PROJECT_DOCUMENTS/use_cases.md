# LinguaFlow (Parakeet) - High Level Use Cases

## 1. Primary and Secondary Actors

### Primary Actors
These are the main users who directly interact with the system to achieve their goals:

1. **Individual Learner** - Young professionals, students aged 18-35 seeking language skills for career, travel, or personal enrichment

### Secondary Actors
These actors support the system or interact with it indirectly:

1. **AI Conversation Engine** - The LLM system that provides conversational practice
2. **Speech Recognition/Synthesis Service** - External APIs for voice interaction (Whisper, AWS Polly, ElevenLabs)
3. **System Administrator** - Parakeet staff managing platform operations

---

## 2. Use Cases by Actor

### Individual Learner Use Cases

#### Core Learning Use Cases
2. **Engage in AI Conversation**
   - Initiate conversation in target language
   - Choose from various scenarios (ordering food, business negotiation, travel, etc.)
   - Receive real-time corrections and feedback
   - Practice pronunciation via voice mode

3. **Complete Adaptive Lessons**
   - Access personalized learning path
   - Complete interactive exercises0
   - Take AI-generated quizzes
   - Review spaced-repetition content

4. **Track Progress**
   - View fluency scores and vocabulary growth
   - Monitor conversation duration metrics
   - Review grammar accuracy trends
   - Access conversation logs and error analysis

5. **Earn Achievements and Maintain Streaks**
   - Collect points and badges
   - Maintain daily learning streaks
   - View leaderboard rankings
   - Unlock new content tiers


### System Administrator Use Cases

1. **Monitor Platform Performance**
   - Track system uptime and latency
   - Monitor AI inference times
   - Identify technical issues


---

## 3. Use Case Diagram

The following diagram illustrates the main use cases and their relationships with actors in the LinguaFlow system.

```
                                    ┌─────────────────────────────┐
                                    │   LinguaFlow System         │
                                    └─────────────────────────────┘
                                               ╱│╲
                    ┌─────────────────────────----
                    │                         
                    │                         
                    ▼                         
        ┌────────────────────┐   
        │ Individual Learner │   
        └────────────────────┘   
                 │                   
                 │                   
     ┌───────────┼
     │           │
     ▼           ▼
┌─────────┐ ┌─────────┐
│Register │ │Engage in│
│& Create │ │AI Conv- │
│Profile  │ │ersation │
└─────────┘ └─────────┘
     │           │     
     │           │            
     │      ┌────┴
     │      │     
     ▼      ▼     
┌─────────┐┌──────┐
│Track    ││Earn  │
│Progress ││Achie-│
│         ││vments│
└─────────┘└──────┘
     │                       
     │                       
     │                       
     │                       
     │                       
     │                                                                                                                 
     │                                               
     │                                               
     │        SECONDARY ACTORS                       
     │                                               
     ▼                                               
┌────────────────────┐              ┌──────────────────────────────────┐
│                    │              │                                  │
│ AI Conversation    │◄─────────────│  Speech Recognition/Synthesis    │
│ Engine             │              │  Service                         │
└────────────────────┘              └──────────────────────────────────┘

---
```



## Use Case Priority Matrix

### High Priority (MVP)
1. Register and Create Profile
2. Engage in AI Conversation
3. Complete Adaptive Lessons
4. Track Progress
5. Earn Achievements and Maintain Streaks
