import { ClientOnly } from "~/components/common/ClientOnly";
import { lazy, Suspense } from "react";

const LineChartImpl = lazy(() => import("./LineChartImpl"));

export default function LineChartOne() {
  return (
    <ClientOnly>
      <Suspense fallback={<div className="h-[310px]" />}>
        <LineChartImpl />
      </Suspense>
    </ClientOnly>
  );
}
