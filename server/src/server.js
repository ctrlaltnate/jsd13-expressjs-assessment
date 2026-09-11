import express from "express";
import mainRouter from "./routes/index.js";
import v1Router from "./routes/v1/index.js";
import cors from "cors";

const app = express();

async function startServer() {
  try {
   
    await app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to the database:", err.message);
    process.exit(1); // Exit the process with an error code
  }
}

app.use(express.json());
app.use(cors()); // เปิดใช้งานก่อน routes เพื่อให้ browser เรียก API ข้าม port ได้
app.use("/", mainRouter);
app.use("/api/v1", v1Router)

// Centralize error handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Something went wrong on the server",
  });
});

const port = 3001;

startServer();
