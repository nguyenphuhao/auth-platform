"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

type Accent = "health" | "league" | "default";

function getInitialAppCode(): Accent {
  if (typeof document === "undefined") {
    return "default";
  }

  const current = document.documentElement.dataset.app;
  if (current === "health" || current === "league") {
    return current;
  }

  return "default";
}

export function AppAccentToggle() {
  const [accent, setAccent] = useState<Accent>("default");

  useEffect(() => {
    setAccent(getInitialAppCode());
  }, []);

  function onSwitch(nextAccent: Accent) {
    document.documentElement.dataset.app = nextAccent;
    localStorage.setItem("app-code", nextAccent);
    setAccent(nextAccent);
  }

  return (
    <div className="inline-flex rounded-md border bg-surface p-1">
      {(["default", "health", "league"] as Accent[]).map((item) => {
        const active = item === accent;

        return (
          <Button
            key={item}
            variant={active ? "primary" : "ghost"}
            size="sm"
            className="capitalize"
            onClick={() => onSwitch(item)}
          >
            {item}
          </Button>
        );
      })}
    </div>
  );
}
