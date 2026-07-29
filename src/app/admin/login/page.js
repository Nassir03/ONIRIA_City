import StaffLoginForm from "../../components/admin/StaffLoginForm";

export const metadata = {
  title: "Staff Login | ONIRIA City",
};

export default function AdminLoginPage() {
  return (
    <main className="adminLoginPage">
      <div>
        <p>ONIRIA CITY STAFF</p>
        <h1>Private admin login</h1>
        <StaffLoginForm />
      </div>
    </main>
  );
}
