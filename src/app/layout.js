import OniriaAIChat from "./components/OniriaAIChat";
import WhatsAppButton from "./components/WhatsAppButton";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "ONIRIA City",
    template: "%s | ONIRIA City",
  },
  description:
    "Explore ONIRIA City, a destination for modern living, lifestyle, investment and commercial opportunities in Zanzibar.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <OniriaAIChat />
        <WhatsAppButton />
      </body>
    </html>
  );
}