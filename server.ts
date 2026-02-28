import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { analyzeScene } from "./src/services/geminiService";
import { storageService } from "./src/services/storageService";
import { AppMode } from "./src/types";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" }
  });

  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Socket.io for real-time interaction
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("analyze", async (data: { 
      image: string; 
      speech: string; 
      mode: AppMode; 
      sessionId: string 
    }) => {
      try {
        const session = storageService.getSession(data.sessionId) || {
          id: data.sessionId,
          mode: data.mode,
          history: []
        };

        const result = await analyzeScene(data.image, data.speech, data.mode, session.history.map(m => ({ role: m.role, content: m.content })));

        // Update session history with full message objects
        const userMsg = { 
          role: 'user' as const, 
          content: data.speech, 
          timestamp: Date.now(), 
          mode: data.mode,
          image: data.image
        };
        const modelMsg = { 
          role: 'model' as const, 
          content: result.analysis, 
          timestamp: Date.now(), 
          mode: data.mode 
        };

        session.history.push(userMsg);
        session.history.push(modelMsg);
        storageService.saveSession(session);

        socket.emit("response", { ...result, history: session.history });
      } catch (error) {
        console.error("Analysis error:", error);
        socket.emit("error", { message: "Failed to analyze scene" });
      }
    });

    socket.on("get_history", (sessionId: string) => {
      const session = storageService.getSession(sessionId);
      if (session) {
        socket.emit("history", session.history);
      }
    });

    socket.on("clear_history", (sessionId: string) => {
      const session = storageService.getSession(sessionId);
      if (session) {
        session.history = [];
        storageService.saveSession(session);
        socket.emit("history", []);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`OmniGuide AI running on http://localhost:${PORT}`);
  });
}

startServer();
