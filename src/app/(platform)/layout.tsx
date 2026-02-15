import Script from "next/script";
import type { ReactNode } from "react";

import { getEnv } from "@/lib/config/env";

export default function PlatformLayout({ children }: { children: ReactNode }) {
  const env = getEnv();

  return (
    <>
      <Script id="platform-theme" strategy="beforeInteractive">
        {`(() => {
          const savedTheme = localStorage.getItem('app-theme');
          const savedAppCode = localStorage.getItem('app-code');
          if (savedTheme === 'light' || savedTheme === 'dark') {
            document.documentElement.dataset.theme = savedTheme;
          } else if (window.location.pathname.startsWith('/admin')) {
            document.documentElement.dataset.theme = 'dark';
          } else {
            document.documentElement.dataset.theme = '${env.appTheme}';
          }

          if (savedAppCode) {
            document.documentElement.dataset.app = savedAppCode;
          } else {
            document.documentElement.dataset.app = '${env.appCode}';
          }
        })();`}
      </Script>
      <div className="platform-ui">{children}</div>
    </>
  );
}
