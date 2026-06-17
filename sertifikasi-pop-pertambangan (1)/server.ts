import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import evaluateHandler from "./api/evaluate";
import scenarioHandler from "./api/ai/scenario";
import tutorHandler from "./api/ai/tutor";

dotenv.config();

const app = express();
app.use(express.json());

// Bind API handlers to Express routes
app.post("/api/evaluate", evaluateHandler);
app.post("/api/ai/scenario", scenarioHandler);
app.post("/api/ai/tutor", tutorHandler);


// Setup dev and production static middleware
async function startServer() {
  const PORT = 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`POPVirtual Server booted locally and running on http://localhost:${PORT}`);
  });
}

startServer();
