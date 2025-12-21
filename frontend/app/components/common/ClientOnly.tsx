import { useEffect, useState } from "react";

export function ClientOnly({ children }: { children: JSX.Element }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return children;
}
