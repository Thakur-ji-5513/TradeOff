import express from "express";
import ConnectDb from "./config/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import tradeoffRouter from "./routes/tradeoff.js";
import roastRouter from "./routes/roast.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

console.log("GEMINI_API_KEY loaded:", process.env.GEMINI_API_KEY ? "Yes (length: " + process.env.GEMINI_API_KEY.length + ")" : "No");

const app = express();

app.use(cors())
const PORT = process.env.PORT || 8080;

// Top level await forces Vercel to establish DB connection before booting Express 
await ConnectDb();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/tradeoff", tradeoffRouter);
app.use("/api/roast", roastRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
 console.log(`Server is running on http://localhost:${PORT}`);
 console.log("and the db is setup too!");
});

// rudra@gmail.com
//pass: hello123

export default app;