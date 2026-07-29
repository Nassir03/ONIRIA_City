"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "../../services/adminApi";

const navItems = [
  ["Dashboard", "/admin", null],
  ["Leads", "/admin/leads", null],
  ["Enquiries", "/admin/enquiries", null],
  ["Brochures", "/admin/brochure-requests", null],
  ["Consultations", "/admin/consultations", null],
  ["Site Visits", "/admin/site-visits", null],
  ["AI Conversations", "/admin/conversations", null],
  ["WhatsApp", "/admin/whatsapp", null],
  ["Campaigns", "/admin/campaigns", null],
  ["Follow-ups", "/admin/follow-ups", null],
  ["Subscribers", "/admin/subscribers", ["administrator", "marketing_staff"]],
  ["Account Recovery", "/admin/account-recovery", ["administrator"]],
  ["Staff", "/admin/staff", null],
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
          {navItems
            .filter(([, , roles]) => !roles || roles.some((role) => session.staff.roles?.includes(role)))
            .map(([label, href]) => (
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
