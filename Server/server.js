import express from "express";
import ConnectDb from "./config/db.js";
import dotenv from "dotenv";
import authRouter from "./routes/auth.js";
import tradeoffRouter from "./routes/tradeoff.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors())
const PORT = process.env.PORT || 8080;

ConnectDb();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/tradeoff", tradeoffRouter);

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