import { useNavigate } from "react-router";
import { apiFetch } from "~/lib/api";
import StudentForm from "./StudentForm";

export default function StudentCreate() {
  const navigate = useNavigate();

  async function handleCreate(formData: FormData, setErrors: any) {
    const res = await apiFetch("/api/students/alumnos/", {
      method: "POST",
      body: formData, // ✅ FormData directo
    });

    if (!res.ok) {
      const err = await res.json();
      setErrors(err);
      return;
    }

    navigate("/app/students");
  }

  return <StudentForm title="Nuevo alumno" onSubmit={handleCreate} />;
}
