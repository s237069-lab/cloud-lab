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

  // =========================
  // CÂU 61: Sinh viên đang sửa
  // =========================
  const [editingId, setEditingId] = useState(null);

  // =========================
  // Lấy danh sách sinh viên
  // =========================
  const getStudents = async () => {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Không thể lấy danh sách sinh viên");
      }

      setStudents(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách sinh viên:", error);
    }
  };

  useEffect(() => {
    getStudents();
  }, []);

  // =========================
  // CÂU 49 + CÂU 61: Thêm / Cập nhật
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // =========================
      // CÂU 61: CẬP NHẬT
      // =========================
      if (editingId) {
        const response = await fetch(
          `/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: studentId,
              name: name,
              email: email,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Không thể cập nhật sinh viên"
          );
        }

        alert("Cập nhật sinh viên thành công!");

        // Cập nhật sinh viên trong danh sách
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingId ? data : student
          )
        );

        // Thoát chế độ cập nhật
        handleCancel();

        return;
      }

      // =========================
      // CÂU 49: THÊM SINH VIÊN
      // =========================
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
        throw new Error(
          data.message || "Không thể thêm sinh viên"
        );
      }

      alert("Thêm sinh viên thành công!");

      // Thêm sinh viên mới vào danh sách
      setStudents((prevStudents) => [
        ...prevStudents,
        data,
      ]);

      // Xóa Form
      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Lỗi:", error);
      alert(error.message);
    }
  };

  // =========================
  // CÂU 61: CHỌN SINH VIÊN ĐỂ SỬA
  // =========================
  const handleEdit = (student) => {
    setEditingId(student._id);

    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // =========================
  // CÂU 61: HỦY CẬP NHẬT
  // =========================
  const handleCancel = () => {
    setEditingId(null);

    setStudentId("");
    setName("");
    setEmail("");
  };

  // =========================
  // CÂU 61: XÓA SINH VIÊN
  // =========================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc muốn xóa sinh viên này không?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Không thể xóa sinh viên"
        );
      }

      alert("Xóa sinh viên thành công!");

      // Xóa khỏi danh sách trên giao diện
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      );

      // Nếu đang sửa sinh viên vừa xóa
      if (editingId === id) {
        handleCancel();
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Xóa sinh viên thất bại!");
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
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student._id}>
              <td>{student.studentId}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>

              <td>
                {/* Nút Sửa */}
                <button
                  type="button"
                  onClick={() => handleEdit(student)}
                >
                  Sửa
                </button>

                {" "}

                {/* Nút Xóa */}
                <button
                  type="button"
                  onClick={() =>
                    handleDelete(student._id)
                  }
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      {/* =========================
          CÂU 48 + 49 + 61: FORM
          ========================= */}

      <h2>
        {editingId
          ? "Cập nhật sinh viên"
          : "Thêm sinh viên"}
      </h2>

      <form onSubmit={handleSubmit}>
        {/* MSSV */}
        <div>
          <label>MSSV: </label>

          <input
            type="text"
            value={studentId}
            onChange={(e) =>
              setStudentId(e.target.value)
            }
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
            onChange={(e) =>
              setName(e.target.value)
            }
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Nhập email"
            required
          />
        </div>

        <br />

        {/* Nút Thêm / Cập nhật */}
        <button type="submit">
          {editingId
            ? "Cập nhật sinh viên"
            : "Thêm sinh viên"}
        </button>

        {/* Nút Hủy */}
        {editingId && (
          <>
            {" "}

            <button
              type="button"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default App;