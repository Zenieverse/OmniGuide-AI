# OmniGuide AI — Gemini Live Agent

“An AI that sees your world and guides you in real time.”

OmniGuide AI is a multimodal AI system built for the Gemini Live Agent Challenge. It demonstrates real-time interaction using vision, speech, and live responses.

## Architecture

- **Frontend**: React + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + Socket.io
- **AI**: Google Gemini 2.5 Flash (Vision & Reasoning)
- **Persistence**: Better-SQLite3 (Local Session Memory)
- **Voice**: Web Speech API (Recognition & Synthesis)

## Core Capabilities

1. **Vision**: Real-time camera stream analysis.
2. **Speech**: Natural language interaction via microphone.
3. **Reasoning**: Context-aware guidance based on visual input.
4. **Overlay**: Dynamic visual highlights and instructions on the camera feed.
5. **Voice**: Spoken responses from the AI agent.

## Setup Instructions

1. **Environment Variables**:
   Ensure `GEMINI_API_KEY` is set in your environment.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## Demo Modes

- **Appliance Fixer**: Show a broken device for repair guidance.
- **Homework Tutor**: Show a math problem for step-by-step solutions.
- **Cooking Assistant**: Show ingredients for recipe suggestions.
- **General**: Ask anything about your surroundings.

## Deployment

This project is ready for Google Cloud Run deployment.

```bash
gcloud run deploy omniguide-ai --source .
```
