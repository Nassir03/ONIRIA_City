import PublicFloatingActions from "./components/PublicFloatingActions";
import "./globals.css";

export const metadata = {
  title: {
    default: "ONIRIA City",
    template: "%s | ONIRIA City",
  },
  description:
    "Explore ONIRIA City, a destination for modern living, lifestyle, investment and commercial opportunities in Zanzibar.",
  icons: {
    icon: "/oniria-favicon.svg",
    shortcut: "/oniria-favicon.svg",
    apple: "/oniria-favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        {children}
        <PublicFloatingActions />
      </body>
    </html>
  );
}
