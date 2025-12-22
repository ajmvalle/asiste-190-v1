import { Outlet } from "react-router";
import PageBreadcrumb from "~/components/common/PageBreadCrumb";

export default function StudentsLayout() {
  return (
    <div className="space-y-6">
      <PageBreadcrumb pageTitle="Alumnos" />
      <Outlet />
    </div>
  );
}
