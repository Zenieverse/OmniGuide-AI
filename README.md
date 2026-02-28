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
<img width="1024" height="1536" alt="IMG_1607" src="https://github.com/user-attachments/assets/6795eb8d-10a4-498e-b146-1ef52aac28bb" />

🧪 Reproducible Testing Instructions
This section explains how judges can reproduce, run, and test OmniGuide AI locally or via the deployed cloud instance.
OmniGuide AI is a real-time multimodal AI assistant built with the Gemini Live API and deployed on Google Cloud.
The system analyzes live camera input and speech, then responds with voice guidance and visual overlays.
1️⃣ Prerequisites
Install the following tools before running the project:
Node.js 18+
npm
Google Cloud CLI
A Gemini API key
Enable the following Google Cloud services:
Vertex AI
Cloud Run
Firestore
Cloud Storage
2️⃣ Clone the Repository
git clone https://github.com/YOUR_USERNAME/omniguide-ai.git
cd omniguide-ai
3️⃣ Configure Environment Variables
Create a .env file inside /backend.
Example:
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=8080
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
4️⃣ Install Dependencies
Backend:
cd backend
npm install
Frontend:
cd ../frontend
npm install
5️⃣ Run the Project Locally
Start the backend:
cd backend
npm start
Start the frontend:
cd frontend
npm run dev
Open the application in your browser:
http://localhost:5173
Allow camera and microphone access when prompted.
6️⃣ Testing the Multimodal Agent
To test the live agent functionality:
Test 1 — Vision + Voice
Point your camera at any object (example: a pipe, device, or book).
Ask a question aloud.
Example:
Why isn't this pipe draining?
Expected result:
AI analyzes the image
AI responds with voice guidance
Visual overlay highlights the relevant object
Test 2 — Homework Tutor Mode
Switch mode to Tutor Mode.
Show a math equation to the camera.
Example:
x² + 5x − 24 = 0
Expected result:
AI reads the equation
Generates step-by-step explanation
Displays visual hints
Test 3 — Cooking Assistant
Show ingredients in the camera.
Example:
What can I cook with these?
Expected result:
AI identifies ingredients
Suggests recipe steps
Shows guided instructions
7️⃣ Cloud Deployment Verification
The backend is deployed on Google Cloud Run.
Judges can verify deployment by:
Viewing the deployment configuration in /deployment/Dockerfile
Running:
gcloud run services list
Or by visiting the deployed endpoint:
https://omniguide-api.run.app
8️⃣ Demo Scenario (Quick Test)
If camera testing is unavailable, click:
“Run Demo Scenario”
This simulates:
appliance repair
homework solving
cooking assistant
without requiring live camera input.
9️⃣ Architecture Overview
User Browser
   │
Camera + Microphone
   │
React Frontend
   │
Node.js Backend
   │
Gemini Live API
   │
AI Response
   │
Voice + Visual Overlay
🔟 Troubleshooting
If camera does not activate:
Ensure browser permissions are enabled
Use Chrome or Edge
Run on localhost or HTTPS
If Gemini API fails:
Verify your API key
Ensure Vertex AI API is enabled.
✔ Expected Result
After setup, judges should be able to:
Speak naturally to the agent
Show objects to the camera
Receive real-time AI guidance
This demonstrates the live multimodal capabilities of OmniGuide AI.
