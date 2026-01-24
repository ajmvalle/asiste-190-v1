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
      // 1️⃣ Pedir permiso primero (stream temporal)
      const tempStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      tempStream.getTracks().forEach((t) => t.stop());

      // 2️⃣ Ahora sí listar cámaras
      const cameras = await getCameras();

      // 👉 intenta USB / cámara externa
      const camera =
        cameras.find((c) => c.label.toLowerCase().includes("usb")) ??
        cameras[1] ??
        cameras[0];

      if (!camera) {
        console.error("No hay cámaras disponibles");
        return;
      }

      // 3️⃣ Stream final
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: camera.deviceId },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      console.log("Usando cámara:", camera.label);
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

    if (!video.videoWidth || !video.videoHeight) {
      throw new Error("Video no listo");
    }

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

  async function getCameras() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((d) => d.kind === "videoinput");
  }

  // Loop de reconocimiento
  async function recognize() {
    if (!videoRef.current) return;

    setStatus("detecting");
    let blob: Blob;

    try {
      blob = captureFrame();
    } catch {
      setStatus("idle");
      return;
    }

    const formData = new FormData();
    formData.append("image", blob);

    try {
      const res = await apiFetch("/api/face/monitor/recognize/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      // DISTANCIA INVÁLIDA
      if (!res.ok && data.reason === "DISTANCE_INVALID") {
        setRecognized({
          alumno: null,
          distance_cm: data.distance_cm,
          message: data.message,
          error: true,
          fecha: new Date().toLocaleString(),
        });
        return;
      }

      // ERROR DE SENSOR
      if (!res.ok && data.reason === "DISTANCE_READ_ERROR") {
        setRecognized({
          alumno: null,
          message: "Error leyendo sensor",
          error: true,
          fecha: new Date().toLocaleString(),
        });
        return;
      }

      if (data.match) {
        setRecognized({
          alumno: data.alumno,
          foto_url: data.foto_url ?? null,
          already_registered: data.already_registered,
          fecha: new Date().toLocaleString(),
        });

        // Pausa 3 segundos para evitar spam
        stopLoop();
        setTimeout(startLoop, 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setStatus("idle");
    }
  }

  function startLoop() {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(recognize, 1500);
  }

  function stopLoop() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // Arrancar loop
  useEffect(() => {
    startLoop();
    return () => stopLoop();
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
        {recognized && recognized.error && (
          <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold">📏 Ajusta tu distancia</h2>
            <p className="mt-2">{recognized.message}</p>

            {recognized.distance_cm && (
              <p className="mt-1 text-sm">
                Distancia actual: <b>{recognized.distance_cm} cm</b>
              </p>
            )}

            <p className="text-xs text-gray-500 mt-2">{recognized.fecha}</p>
          </div>
        )}

        {recognized && !recognized.error && (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md flex items-center gap-6">
            {recognized.foto_url && (
              <img
                src={recognized.foto_url}
                alt={recognized.alumno}
                className="w-24 h-24 rounded-full object-cover border"
              />
            )}

            <div>
              <h2 className="text-xl font-semibold">
                👋 Bienvenido al CBTIS 190
              </h2>

              <p className="text-lg mt-1">{recognized.alumno}</p>

              <p className="text-sm text-gray-500">
                {recognized.already_registered
                  ? "Asistencia ya registrada hoy"
                  : "Asistencia registrada correctamente"}
              </p>

              <p className="text-xs text-gray-400 mt-1">{recognized.fecha}</p>
            </div>
          </div>
        )}
      </ComponentCard>
    </div>
  );
}
