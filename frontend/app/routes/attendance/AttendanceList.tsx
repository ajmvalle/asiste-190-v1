import { useState } from "react";
import ComponentCard from "~/components/common/ComponentCard";
import Input from "~/components/form/input/InputField";
import Select from "~/components/form/Select";
import Button from "~/components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { apiFetch } from "~/lib/api";

interface Asistencia {
  id: number;
  numero_control: string;
  nombre: string;
  grado: number;
  grupo: string;
  turno: string;
  especialidad: string;
  hora?: string;
  foto_url?: string | null;
}

export default function AttendanceList() {
  const [date, setDate] = useState("");
  const [filters, setFilters] = useState({
    grado: "",
    grupo: "",
    turno: "",
    especialidad: "",
  });

  const [asistencias, setAsistencias] = useState<Asistencia[]>([]);
  const [inasistencias, setInasistencias] = useState<Asistencia[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadData() {
    if (!date) return;

    setLoading(true);

    const params = new URLSearchParams({
      date,
      ...filters,
    }).toString();

    try {
      const res = await apiFetch(`/api/face/attendance/by-date/?${params}`);
      const data = await res.json();

      setAsistencias(data.asistencias);
      setInasistencias(data.inasistencias);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 🔍 Filtros */}
      <ComponentCard title="Consulta de asistencias">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Select
            value={filters.grado}
            placeholder="Grado"
            options={[1, 2, 3, 4, 5, 6].map((v) => ({
              value: v.toString(),
              label: v.toString(),
            }))}
            onChange={(v) => setFilters((f) => ({ ...f, grado: v }))}
          />

          <Select
            value={filters.grupo}
            placeholder="Grupo"
            options={[
              { value: "A", label: "A" },
              { value: "B", label: "B" },
            ]}
            onChange={(v) => setFilters((f) => ({ ...f, grupo: v }))}
          />

          <Select
            value={filters.turno}
            placeholder="Turno"
            options={[
              { value: "M", label: "Matutino" },
              { value: "V", label: "Vespertino" },
            ]}
            onChange={(v) => setFilters((f) => ({ ...f, turno: v }))}
          />

          <Button onClick={loadData} disabled={loading}>
            {loading ? "Consultando…" : "Consultar"}
          </Button>
        </div>
      </ComponentCard>

      {/* ✅ ASISTENCIAS */}
      <ComponentCard title={`Asistencias (${asistencias.length})`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Alumno</TableCell>
                <TableCell isHeader>Grado</TableCell>
                <TableCell isHeader>Grupo</TableCell>
                <TableCell isHeader>Turno</TableCell>
                <TableCell isHeader>Especialidad</TableCell>
                <TableCell isHeader>Hora</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {asistencias.length === 0 && (
                <TableRow>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No hay asistencias registradas
                  </td>
                </TableRow>
              )}

              {asistencias.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full border">
                        {a.foto_url ? (
                          <img
                            src={a.foto_url}
                            alt={a.nombre}
                            className="w-10 h-10 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded-full">
                            N/A
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {a.nombre}
                        </span>
                        <span className="block text-gray-500 text-xs">
                          {a.numero_control}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{a.grado}</TableCell>
                  <TableCell>{a.grupo}</TableCell>
                  <TableCell>{a.turno}</TableCell>
                  <TableCell>{a.especialidad}</TableCell>
                  <TableCell>{a.hora ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ComponentCard>

      {/* ❌ INASISTENCIAS */}
      <ComponentCard title={`Inasistencias (${inasistencias.length})`}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell isHeader>Alumno</TableCell>
                <TableCell isHeader>Grado</TableCell>
                <TableCell isHeader>Grupo</TableCell>
                <TableCell isHeader>Turno</TableCell>
                <TableCell isHeader>Especialidad</TableCell>
              </TableRow>
            </TableHeader>

            <TableBody>
              {inasistencias.length === 0 && (
                <TableRow>
                  <td
                    colSpan={5}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No hay inasistencias
                  </td>
                </TableRow>
              )}

              {inasistencias.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full border">
                        {a.foto_url ? (
                          <img
                            src={a.foto_url}
                            alt={a.nombre}
                            className="w-10 h-10 object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-500 text-xs rounded-full">
                            N/A
                          </div>
                        )}
                      </div>

                      <div>
                        <span className="block font-medium text-gray-800 dark:text-white/90">
                          {a.nombre}
                        </span>
                        <span className="block text-gray-500 text-xs">
                          {a.numero_control}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{a.grado}</TableCell>
                  <TableCell>{a.grupo}</TableCell>
                  <TableCell>{a.turno}</TableCell>
                  <TableCell>{a.especialidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ComponentCard>
    </div>
  );
}
