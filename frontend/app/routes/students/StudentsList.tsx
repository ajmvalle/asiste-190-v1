import { useEffect, useState } from "react";
import { Link } from "react-router";
import ComponentCard from "~/components/common/ComponentCard";
import Swal from "sweetalert2";
import { confirmDelete } from "~/lib/confirm";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { apiFetch } from "~/lib/api";

interface Alumno {
  id: number;
  numero_control: string;
  nombre_completo: string;
  grado: number;
  grupo: string;
  turno: string;
}

export default function StudentsList() {
  const [students, setStudents] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const res = await apiFetch("/api/students/alumnos/");

        if (!res.ok) {
          console.error("Error al cargar alumnos");
          return;
        }

        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("Error de conexión", err);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando alumnos…</p>;
  }

  async function handleDelete(id: number) {
    const result = await confirmDelete(
      "Este alumno será eliminado permanentemente"
    );

    if (!result.isConfirmed) return;

    try {
      const res = await apiFetch(`/api/students/alumnos/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Error al eliminar");
      }

      // quitar del estado sin recargar
      setStudents((prev) => prev.filter((a) => a.id !== id));

      Swal.fire({
        icon: "success",
        title: "Alumno eliminado",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo eliminar el alumno",
      });
    }
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Link
          to="new"
          className="px-4 py-2 text-sm font-medium text-white rounded bg-brand-500 hover:bg-brand-600"
        >
          + Nuevo alumno
        </Link>
      </div>

      <ComponentCard title="Listado de alumnos">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>No. Control</TableCell>
                <TableCell isHeader>Nombre</TableCell>
                <TableCell isHeader>Grado</TableCell>
                <TableCell isHeader>Grupo</TableCell>
                <TableCell isHeader>Turno</TableCell>
                <TableCell isHeader>Acciones</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {students.length === 0 && (
                <TableRow>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No hay alumnos registrados
                  </td>
                </TableRow>
              )}

              {students.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.numero_control}</TableCell>
                  <TableCell>{a.nombre_completo}</TableCell>
                  <TableCell>{a.grado}</TableCell>
                  <TableCell>{a.grupo}</TableCell>
                  <TableCell>{a.turno}</TableCell>
                  <TableCell className="space-x-3">
                    <Link
                      to={`${a.id}/edit`}
                      className="text-brand-500 hover:underline"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => handleDelete(a.id)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ComponentCard>
    </>
  );
}
