import type { Metadata, Viewport } from "next";
import { AgeGate } from "@/components/layout/age-gate";
import { ageScript } from "@/components/layout/age-script";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Providers } from "@/components/providers";
import { demo, site } from "@/config/site";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${site.name} | ${site.slogan}`, template: `%s | ${site.name}` },
  description: site.intro,
  applicationName: site.name,
  other: { rating: "adult" },
  robots: demo.noIndex ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: ageScript }} />
      </head>
      <body>
        <Providers>
          <div id="app">
            <a href="#main" className="sr-only z-50 bg-brand p-3 focus:not-sr-only focus:fixed focus:start-2 focus:top-2 focus:text-white">رفتن به محتوای اصلی</a>
            <Header />
            <main id="main" className="min-h-[70svh]">{children}</main>
            <Footer />
          </div>
          <AgeGate />
        </Providers>
      </body>
    </html>
  );
}
