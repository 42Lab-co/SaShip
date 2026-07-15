import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import { Suspense } from "react";
import { cookies } from "next/headers";
import "./globals.css";
import { Nav } from "@/components/nav";
import { getConfig, getScopes } from "@/lib/config";
import { pickDefaultScope, SCOPE_COOKIE } from "@/lib/scope";
import { getSyncLog } from "@/lib/sync-log";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  return {
    title: `${config.project} — SaShip`,
    description: `Shipping visibility for ${config.project}`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [config, syncLog, cookieStore] = await Promise.all([
    getConfig(),
    getSyncLog(),
    cookies(),
  ]);
  const scopes = getScopes(config);
  const defaultScope = pickDefaultScope(cookieStore.get(SCOPE_COOKIE)?.value, config);
  return (
    <html lang="en">
      <body className={`${ibmPlexMono.variable} font-mono antialiased`}>
        <Suspense fallback={null}>
          <Nav
            projectName={config.project}
            lastSync={syncLog.lastSync}
            scopes={scopes}
            defaultScope={defaultScope}
          />
        </Suspense>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
