import { useEffect, useRef, useState } from "react";
import ComponentCard from "~/components/common/ComponentCard";
import { apiFetch } from "~/lib/api";

export default function Monitor() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<any>(null);

  const [status, setStatus] = useState<"idle" | "detecting">("idle");
  const [recognized, setRecognized] = useState<any>(null);

  // 🔹 Iniciar cámara
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
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // 🔹 Capturar frame
  function captureFrame(): Blob {
    const video = videoRef.current!;
    const canvas = document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext("2d")!.drawImage(video, 0, 0);

    const dataURL = canvas.toDataURL("image/jpeg");
    const byteString = atob(dataURL.split(",")[1]);

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: "image/jpeg" });
  }

  // 🔹 Loop de reconocimiento
  async function recognize() {
    if (!videoRef.current) return;

    setStatus("detecting");

    const blob = captureFrame();
    const formData = new FormData();
    formData.append("image", blob);

    try {
      const res = await apiFetch("/api/face/monitor/recognize/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.match) {
        setRecognized({
          nombre: data.alumno,
          fecha: new Date().toLocaleString(),
          foto: data.photo_url ?? null,
        });

        // ⏸️ Pausa 3 segundos para evitar spam
        clearInterval(intervalRef.current);
        setTimeout(startLoop, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStatus("idle");
    }
  }

  function startLoop() {
    intervalRef.current = setInterval(recognize, 1500);
  }

  // 🔹 Arrancar loop
  useEffect(() => {
    startLoop();
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* 🎥 Cámara */}
      <ComponentCard title="Monitor de acceso">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded border"
        />
        <p className="mt-2 text-sm text-gray-500">
          Estado: {status === "detecting" ? "Detectando…" : "En espera"}
        </p>
      </ComponentCard>

      {/* 👤 Resultado */}
      <ComponentCard title="Bienvenido al CBTIS 190">
        {recognized ? (
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-semibold">Hola, {recognized.nombre}</h2>
            <p className="text-gray-500">{recognized.fecha}</p>

            {recognized.foto && (
              <img
                src={recognized.foto}
                alt="Foto"
                className="mx-auto w-40 h-40 rounded-full object-cover"
              />
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Esperando reconocimiento…</p>
        )}
      </ComponentCard>
    </div>
  );
}
