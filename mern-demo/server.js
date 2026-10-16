

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Thêm thư viện CORS

const app = express();
/*
app.use(cors()); // Cho phép React truy cập API
app.use(express.json());
require("dotenv").config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

*/
const PORT = 5000;

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend đang hoạt động!"
    });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});


app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use(express.json());

app.post('/api/students', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Thêm route cho trang chủ /
app.get('/', (req, res) => {
  res.send('API Backend đang hoạt động!');
});