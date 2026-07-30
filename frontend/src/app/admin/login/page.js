import StaffLoginForm from "../../components/admin/StaffLoginForm";

export const metadata = {
  title: "Staff Login | ONIRIA City",
};

export default function AdminLoginPage() {
  return (
    <main className="adminLoginPage">
      <div className="adminLoginHero">
        <p>ONIRIA CITY STAFF</p>
        <h1>Secure access for authorised team members</h1>
        <span>Manage leads, enquiries, appointments and staff operations from the private ONIRIA workspace.</span>
      </div>
      <div className="adminLoginCard">
        <p>Staff Portal</p>
        <h2>Sign in</h2>
        <StaffLoginForm />
      </div>
    </main>
  );
}
