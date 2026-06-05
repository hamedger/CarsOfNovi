import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C.A.R.S. – Complete Auto Repair Specialist",
  description:
    "Expert auto repair services. Book appointments and request estimates online. Certified mechanics with years of experience.",
  keywords:
    "auto repair, car repair, engine repair, diagnostics, brakes, suspension, oil change, electrical repair",
  openGraph: {
    title: "C.A.R.S. – Complete Auto Repair Specialist",
    description:
      "Expert auto repair services. Book appointments and request estimates online.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.BookAPTConfig={businessId:"PxaR98auJkN4a0YuTORaiziFo5e2",position:"button",embedMode:"fullscreen",theme:"default",buttonText:"Book Appointment",buttonColor:"#667eea",showPoweredBy:true,hideFloatingButton:true};`,
          }}
        />
      </head>
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  );
}
