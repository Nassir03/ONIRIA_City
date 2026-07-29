import OniriaAIChat from "./components/OniriaAIChat";
import WhatsAppButton from "./components/WhatsAppButton";
import "./globals.css";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <OniriaAIChat />
        <WhatsAppButton />
      </body>
    </html>
  );
}
