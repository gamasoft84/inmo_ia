import type { Metadata } from "next";
import { Sora } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const sora = Sora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "InmoIA — Agencia con IA",
  description: "Tu agencia vende más mientras la IA trabaja por ti",
  manifest: "/manifest.json",
  icons: {
    icon:  [
      { url: "/icons/icon-32.png",  sizes: "32x32",   type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: { url: "/icons/icon-180.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased">
        <Script
          id="theme-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var colorTheme = localStorage.getItem('inmoia-color-theme') || 'amber';
                  var darkModeRaw = localStorage.getItem('inmoia-dark-mode');
                  var uiTheme = darkModeRaw === 'true' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-color-theme', colorTheme);
                  document.documentElement.setAttribute('data-theme', uiTheme);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
