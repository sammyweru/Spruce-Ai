// FIX: Add React import for React.ReactNode type
import React from 'react';
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ['400', '700', '800'] });

export const metadata: Metadata = {
  title: "Spruce - AI Interior Design",
  description: "Upload a photo of your room, and let Spruce, your AI interior design assistant, generate stunning new designs. Refine ideas, find shoppable items, and create your perfect space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor'%3E%3Cpath d='M20.25 10.375L12 2.125L3.75 10.375V21.75H9.75V15.75H14.25V21.75H20.25V10.375ZM12 0.75L22.5 11.25V23.25H15.75V17.25H8.25V23.25H1.5V11.25L12 0.75Z' /%3E%3Cpath d='M12 5.513c-2.35 0-4.453 0.88-6.09 2.34l1.18 1.18c1.334-1.18 2.99-1.853 4.91-1.853s3.576 0.673 4.91 1.853l1.18-1.18c-1.636-1.46-3.74-2.34-6.09-2.34z' /%3E%3C/svg%3E" />
      </head>
      <body className={`${manrope.className} bg-slate-100 text-slate-800 overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}