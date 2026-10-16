const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();
mongoose.connect("mongodb+srv://cloud_user:Ly%40170905@cluster0.7idty7z.mongodb.net/cloud_lab?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
  
const app = express();

const PORT = 5000;

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Backend đang hoạt động!"
    });
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log("Lab 06 - Testing Auto Deploy");
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


app.put('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});


app.delete('/api/students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: 'Không tìm thấy sinh viên'
      });
    }

    res.json({
      message: 'Xóa sinh viên thành công',
      student
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});