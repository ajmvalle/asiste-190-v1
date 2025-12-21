import type { Route } from "./+types/dashboard";
import { Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import PageBreadcrumb from "~/components/common/PageBreadCrumb";
import PageMeta from "~/components/common/PageMeta";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <p>Cargando sesión...</p>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/", { replace: true });
  }

  return (
    <div>
      <PageMeta
        title="React.js Blank Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="Este es el panel de control de React.js para TailAdmin - Plantilla de panel de administración de Next.js"
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full max-w-[630px] text-center">
          <h3 className="mb-4 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
            Título del Panel de Control
          </h3>

          <p className="text-gray-700 dark:text-gray-300">
            Bienvenido, <strong>{user.username}</strong>
          </p>

          <button
            onClick={handleLogout}
            className="w-full rounded-md bg-red-600 py-2 text-white font-semibold
                     hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
