"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const OniriaAIChat = dynamic(() => import("./OniriaAIChat"), { ssr: false });
const WhatsAppButton = dynamic(() => import("./WhatsAppButton"), { ssr: false });

export default function PublicFloatingActions() {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <OniriaAIChat />
      <WhatsAppButton />
    </>
  );
}
