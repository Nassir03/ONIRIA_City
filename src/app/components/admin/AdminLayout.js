"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "../../services/adminApi";

const navItems = [
  ["Dashboard", "/admin"],
  ["Leads", "/admin/leads"],
  ["Enquiries", "/admin/enquiries"],
  ["Brochures", "/admin/brochure-requests"],
  ["Consultations", "/admin/consultations"],
  ["Site Visits", "/admin/site-visits"],
  ["AI Conversations", "/admin/conversations"],
  ["WhatsApp", "/admin/whatsapp"],
  ["Campaigns", "/admin/campaigns"],
  ["Follow-ups", "/admin/follow-ups"],
  ["Staff", "/admin/staff"],
];

export default function AdminLayout({ title, children }) {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .session()
      .then(setSession)
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  async function logout() {
    try {
      await adminApi.logout();
      router.replace("/admin/login");
    } catch (err) {
      setError(err.message);
    }
  }

  if (!session) {
    return <main className="adminLoading">Checking staff session...</main>;
  }

  return (
    <main className="adminShell">
      <aside className="adminSidebar">
        <Link href="/admin" className="adminBrand">
          ONIRIA CITY
        </Link>
        <nav>
          {navItems.map(([label, href]) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="adminMain">
        <header className="adminTopbar">
          <div>
            <p>PRIVATE STAFF AREA</p>
            <h1>{title}</h1>
          </div>
          <div className="adminStaffBadge">
            <span>{session.staff.full_name}</span>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        {error && <div className="adminError">{error}</div>}
        {children}
      </section>
    </main>
  );
}
