import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { apiFetch } from "~/lib/api";
import StudentForm from "./StudentForm";

export default function StudentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apiFetch(`/api/students/alumnos/${id}/`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  async function handleUpdate(formData: FormData, setErrors: any) {
    const res = await apiFetch(`/api/students/alumnos/${id}/`, {
      method: "PUT",
      body: formData, // ✅
    });

    if (!res.ok) {
      const err = await res.json();
      setErrors(err);
      return;
    }

    navigate("/app/students");
  }

  if (!data) return null;

  return (
    <StudentForm
      title="Editar alumno"
      initialData={data}
      onSubmit={handleUpdate}
    />
  );
}
