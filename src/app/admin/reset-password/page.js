import { Suspense } from "react";
import ResetPasswordForm from "../../components/admin/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset Staff Password | ONIRIA City",
};

export default function ResetPasswordPage() {
  return (
    <main className="adminLoginPage">
      <div>
        <p>ONIRIA CITY STAFF</p>
        <h1>Reset Staff Password</h1>
        <p className="adminAuthIntro">Create a new password for your private ONIRIA staff access.</p>
        <Suspense fallback={<div className="adminLoading">Loading reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
