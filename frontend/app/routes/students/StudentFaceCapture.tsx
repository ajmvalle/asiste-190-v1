import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ComponentCard from "~/components/common/ComponentCard";
import Button from "~/components/ui/button/Button";
import { apiFetch } from "~/lib/api";
import Swal from "sweetalert2";

export default function StudentFaceCapture() {
  const { id } = useParams();
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [capturing, setCapturing] = useState(false);

  // 🔹 Cargar alumno
  useEffect(() => {
    apiFetch(`/api/students/alumnos/${id}/`)
      .then((res) => res.json())
      .then(setStudent)
      .finally(() => setLoading(false));
  }, [id]);

  // 🔹 Activar cámara
  useEffect(() => {
    async function startCamera() {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    }

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // 🔹 Capturar frame
  function captureFrame(): Blob {
    const video = videoRef.current!;
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg");

    const byteString = atob(dataURL.split(",")[1]);
    const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  // 🔹 Enviar al backend
  async function handleCapture() {
    setCapturing(true);

    try {
      const blob = captureFrame();
      const formData = new FormData();
      formData.append("image", blob);

      const res = await apiFetch(`/api/face/students/${id}/face/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Error al capturar rostro");
      }

      Swal.fire({
        icon: "success",
        title: "Rostro registrado",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/app/students");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message,
      });
    } finally {
      setCapturing(false);
    }
  }

  if (loading) return null;

  return (
    <ComponentCard title="Captura de rostro">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Alumno: <strong>{student.nombre_completo}</strong>
        </p>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full max-w-md rounded border"
        />

        <Button onClick={handleCapture} disabled={capturing}>
          {capturing ? "Capturando…" : "Capturar rostro"}
        </Button>
      </div>
    </ComponentCard>
  );
}
