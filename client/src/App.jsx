import { useEffect, useState } from "react";

function App() {
  // =========================
  // CÂU 47: Danh sách sinh viên
  // =========================
  const [students, setStudents] = useState([]);

  // =========================
  // CÂU 48: State cho Form
  // =========================
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Lấy danh sách sinh viên từ Backend
  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
      })
      .catch((error) => {
        console.error("Lỗi lấy danh sách sinh viên:", error);
      });
  }, []);

  // =========================
  // CÂU 49: Thêm sinh viên
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: studentId,
          name: name,
          email: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Không thể thêm sinh viên");
      }

      // Thông báo thành công
      alert("Thêm sinh viên thành công!");

      // Thêm sinh viên mới vào danh sách trên giao diện
      setStudents((prevStudents) => [
        ...prevStudents,
        data,
      ]);

      // Xóa nội dung Form
      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Thêm sinh viên thất bại!");
    }
  };

  return (
    <div>
      {/* =========================
          CÂU 47: DANH SÁCH SINH VIÊN
          ========================= */}
      <h1>Danh sách sinh viên</h1>

      <table border="1">
        <thead>
          <tr>
            <th>Mã sinh viên</th>
            <th>Họ tên</th>
            <th>Email</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* =========================
          CÂU 48 + 49: FORM THÊM SV
          ========================= */}
      <h2>Thêm sinh viên</h2>

      <form onSubmit={handleSubmit}>
        {/* MSSV */}
        <div>
          <label>MSSV: </label>

          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="Nhập MSSV"
            required
          />
        </div>

        <br />

        {/* Họ tên */}
        <div>
          <label>Họ tên: </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập họ tên"
            required
          />
        </div>

        <br />

        {/* Email */}
        <div>
          <label>Email: </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
          />
        </div>

        <br />

        {/* CÂU 49 */}
        <button type="submit">
          Thêm sinh viên
        </button>
      </form>
    </div>
  );
}

export default App;