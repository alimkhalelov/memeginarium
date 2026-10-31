import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memeginarium — Имаджинариум для мемов",
  description: "Классический Imaginarium / Dixit на вертикальных карточках с актуальными СНГ мемами 2026 года.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased bg-black text-white selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
