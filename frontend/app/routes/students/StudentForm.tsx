import { useState } from "react";
import ComponentCard from "~/components/common/ComponentCard";
import Label from "~/components/form/Label";
import Input from "~/components/form/input/InputField";
import Button from "~/components/ui/button/Button";
import DropzoneComponent from "~/components/form/form-elements/DropZone";
import Select from "~/components/form/Select";

interface Props {
  title: string;
  initialData?: any;
  onSubmit: (data: FormData, setErrors: (e: any) => void) => Promise<void>;
}

export default function StudentForm({ title, initialData, onSubmit }: Props) {
  const [form, setForm] = useState({
    numero_control: initialData?.numero_control ?? "",
    curp: initialData?.curp ?? "",
    nombre_completo: initialData?.nombre_completo ?? "",
    especialidad: initialData?.especialidad ?? "",
    grado: initialData?.grado ?? "",
    grupo: initialData?.grupo ?? "",
    turno: initialData?.turno ?? "",
  });

  const [foto, setFoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [fotoPreview, setFotoPreview] = useState<string | null>(
    initialData?.foto_url ?? null // ← URL que venga del backend
  );

  const handleFotoSelect = (file: File | null) => {
    setFoto(file);

    if (file) {
      setFotoPreview(URL.createObjectURL(file));
    } else {
      setFotoPreview(null);
    }
  };

  const ESPECIALIDADES = [
    { value: "PROG", label: "Programación" },
    { value: "OFI", label: "Ofimática" },
    { value: "CONT", label: "Contabilidad" },
    { value: "CIA", label: "Comercio Internacional y Aduanas" },
    { value: "ENF", label: "Enfermería" },
    { value: "IA", label: "Inteligencia Artificial" },
    { value: "CIB", label: "Ciberseguridad" },
    { value: "ARH", label: "Administración de Recursos Humanos" },
  ];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    const payload = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      payload.append(key, value as string);
    });

    if (foto) {
      payload.append("foto", foto);
    }

    try {
      await onSubmit(payload, setErrors);
    } finally {
      setSubmitting(false);
    }
  }

  const error = (field: string) =>
    errors[field] && (
      <p className="mt-1 text-sm text-error-500">{errors[field][0]}</p>
    );

  return (
    <ComponentCard title={title}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-4">
            {/* Datos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>No. Control *</Label>
                <Input
                  name="numero_control"
                  value={form.numero_control}
                  onChange={handleChange}
                />
                {error("numero_control")}
              </div>

              <div>
                <Label>CURP *</Label>
                <Input name="curp" value={form.curp} onChange={handleChange} />
                {error("curp")}
              </div>
            </div>

            <div>
              <Label>Nombre completo *</Label>
              <Input
                name="nombre_completo"
                value={form.nombre_completo}
                onChange={handleChange}
              />
              {error("nombre_completo")}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Grado</Label>
                <Select
                  value={form.grado}
                  options={[1, 2, 3, 4, 5, 6].map((v) => ({
                    value: v.toString(),
                    label: v.toString(),
                  }))}
                  onChange={(v) => setForm({ ...form, grado: v })}
                />
                {error("grado")}
              </div>

              <div>
                <Label>Grupo</Label>
                <Select
                  value={form.grupo}
                  options={[
                    { value: "A", label: "A" },
                    { value: "B", label: "B" },
                  ]}
                  onChange={(v) => setForm({ ...form, grupo: v })}
                />
                {error("grupo")}
              </div>

              <div>
                <Label>Turno</Label>
                <Select
                  value={form.turno}
                  options={[
                    { value: "M", label: "Matutino" },
                    { value: "V", label: "Vespertino" },
                  ]}
                  onChange={(v) => setForm({ ...form, turno: v })}
                />
                {error("turno")}
              </div>
            </div>
            <div>
              <div>
                <Label>Especialidad *</Label>
                <Select
                  options={ESPECIALIDADES}
                  value={form.especialidad}
                  onChange={(value) =>
                    setForm((prev) => ({
                      ...prev,
                      especialidad: value,
                    }))
                  }
                />
                {error("especialidad")}
              </div>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Guardando…" : "Guardar"}
            </Button>
          </div>
          <div>
            <DropzoneComponent
              preview={fotoPreview}
              onFileSelect={handleFotoSelect}
            />
          </div>
        </div>
      </form>
    </ComponentCard>
  );
}
