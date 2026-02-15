"use client";

import { useEffect, useRef } from "react";

type SwaggerSystem = {
  destroy?: () => void;
};

export function SwaggerUiPanel() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    let system: SwaggerSystem | undefined;

    async function renderSwagger() {
      const { default: SwaggerUIBundle } = await import("swagger-ui-dist/swagger-ui-bundle");

      if (!isMounted || !mountRef.current) {
        return;
      }

      system = SwaggerUIBundle({
        domNode: mountRef.current,
        url: "/api/openapi",
        docExpansion: "list",
        defaultModelsExpandDepth: 1,
        persistAuthorization: true
      }) as SwaggerSystem;
    }

    void renderSwagger();

    return () => {
      isMounted = false;
      system?.destroy?.();

      if (mountRef.current) {
        mountRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div ref={mountRef} />
  );
}
