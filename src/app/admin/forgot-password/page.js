import ForgotPasswordForm from "../../components/admin/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password | ONIRIA City Staff",
};

export default function ForgotPasswordPage() {
  return (
    <main className="adminLoginPage">
      <div>
        <p>ONIRIA CITY STAFF</p>
        <h1>Staff Account Recovery</h1>
        <p className="adminAuthIntro">Enter your registered staff email to request reset instructions.</p>
        <ForgotPasswordForm />
      </div>
    </main>
  );
}
