import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nammude Veedu · House Building Tracker",
  description: "Track every rupee that goes into building your home.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
