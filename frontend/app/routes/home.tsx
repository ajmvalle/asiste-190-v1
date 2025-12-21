import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Auth Django + React | TailAdmin" },
    {
      name: "description",
      content:
        "Aplicación de autenticación Django - React con TailAdmin, React Router y Tailwind CSS",
    },
  ];
}

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="animate-pulse text-gray-500 dark:text-gray-400">
          Cargando…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* HERO */}
      <section className="relative">
        {/* fondo decorativo */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-3xl" />
          <div className="absolute top-1/2 -left-40 h-[420px] w-[420px] rounded-full bg-success-500/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-14 lg:grid-cols-2 items-center">
            {/* TEXTO */}
            <div className="space-y-7 animate-fade-in">
              <span
                className="inline-flex rounded-full bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-600
                               dark:bg-brand-500/15 dark:text-brand-400"
              >
                Plantilla base educativa
              </span>

              <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-gray-900 dark:text-white">
                Autenticación moderna con <br />
                <span className="bg-gradient-to-r from-brand-500 to-success-500 bg-clip-text text-transparent">
                  Django · React · TailAdmin
                </span>
              </h1>

              <p className="max-w-xl text-lg text-gray-600 dark:text-gray-400">
                Proyecto base listo para enseñar y construir aplicaciones
                reales: backend sólido, frontend desacoplado y arquitectura
                clara desde el día uno.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                {!user && (
                  <>
                    <button
                      onClick={() => navigate("/auth/login")}
                      className="
                        rounded-xl
                        bg-gradient-to-r from-brand-500 to-brand-600
                        px-7 py-3
                        text-white text-sm font-semibold
                        shadow-lg shadow-brand-500/25
                        transition-all duration-300
                        hover:from-brand-600 hover:to-brand-700
                        hover:-translate-y-0.5
                        active:scale-[0.98]
                      "
                    >
                      Iniciar sesión
                    </button>

                    <button
                      onClick={() => navigate("/auth/register")}
                      className="
                        rounded-xl
                        border border-gray-300
                        px-7 py-3
                        text-sm font-medium text-gray-700
                        transition-all duration-300
                        hover:bg-gray-100 hover:-translate-y-0.5
                        dark:border-gray-700 dark:text-gray-300
                        dark:hover:bg-white/5
                      "
                    >
                      Crear cuenta
                    </button>
                  </>
                )}

                {user && (
                  <button
                    onClick={() => navigate("/app/dashboard")}
                    className="
                      rounded-xl
                      bg-gradient-to-r from-success-500 to-success-600
                      px-7 py-3
                      text-white text-sm font-semibold
                      shadow-lg shadow-success-500/25
                      transition-all duration-300
                      hover:-translate-y-0.5
                    "
                  >
                    Ir al Dashboard
                  </button>
                )}
              </div>
            </div>

            {/* CARD VISUAL */}
            <div className="relative animate-fade-in delay-150">
              <div
                className="
                  rounded-2xl
                  border border-gray-200
                  bg-white/80
                  backdrop-blur-xl
                  p-8
                  shadow-[0_30px_80px_-20px_rgba(0,0,0,0.2)]
                  transition-all duration-500
                  hover:-translate-y-1
                  dark:border-gray-800 dark:bg-white/[0.05]
                "
              >
                <h3 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
                  ¿Qué incluye esta plantilla?
                </h3>

                <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex gap-2">
                    <span>✔️</span> Autenticación segura con Django
                  </li>
                  <li className="flex gap-2">
                    <span>✔️</span> React Router (API moderna)
                  </li>
                  <li className="flex gap-2">
                    <span>✔️</span> Tailwind CSS v4 + TailAdmin
                  </li>
                  <li className="flex gap-2">
                    <span>✔️</span> Dark mode listo
                  </li>
                  <li className="flex gap-2">
                    <span>✔️</span> Arquitectura clara para alumnos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECNOLOGÍAS */}
      <section className="border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 className="mb-14 text-center text-2xl font-semibold text-gray-900 dark:text-white">
            Stack Tecnológico
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: "Django", desc: "Backend robusto y seguro" },
              { title: "React", desc: "Frontend moderno y desacoplado" },
              { title: "React Router", desc: "Ruteo avanzado y escalable" },
              {
                title: "TailAdmin",
                desc: "UI profesional lista para producción",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="
                  group
                  rounded-2xl
                  border border-gray-200
                  bg-white
                  p-6
                  shadow-theme-sm
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-lg
                  dark:border-gray-800 dark:bg-gray-800
                "
              >
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
