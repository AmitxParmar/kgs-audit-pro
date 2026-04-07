import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";
import { authMiddleware } from "./middleware/auth";
import auditLifecycleRoutes from "./modules/audit-lifecycle/routes";
import clientOnboardingRoutes from "./modules/client-onboarding/routes";
import contractsRoutes from "./modules/contract/contract.routes";
import auditReportingRoutes from "./modules/audit-reporting/audit-reporting.routes";
import certificationBodiesRoutes from "./modules/certification-bodies/certification-bodies.routes";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.ALLOWED_ORIGINS?.split(",")
        : ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/audit-lifecycle", authMiddleware, auditLifecycleRoutes);
// Add other module routes here
app.use("/api/client-onboarding", clientOnboardingRoutes);
app.use("/api/contracts", contractsRoutes);

app.use("/api/audit-report", auditReportingRoutes);
app.use("/api/certification-bodies", certificationBodiesRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

export default app;
