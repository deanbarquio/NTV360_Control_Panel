import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import featureRoutes from "./routes/featureRoutes";
import logsRoutes from "./routes/auditLogsRoutes"

console.log("ROUTE TYPE:", typeof featureRoutes); 
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth", authRoutes);
app.use("/api/features", featureRoutes); 
app.use("/api/logs", logsRoutes); 


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
