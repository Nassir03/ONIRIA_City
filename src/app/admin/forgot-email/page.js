import { Suspense } from "react";
import ForgotEmailForm from "../../components/admin/auth/ForgotEmailForm";

export const metadata = {
  title: "Forgot Staff Email | ONIRIA City",
};

export default function ForgotEmailPage() {
  return (
    <main className="adminLoginPage">
      <div>
        <p>ONIRIA CITY STAFF</p>
        <h1>Recover Staff Access</h1>
        <p className="adminAuthIntro">Submit a request for an authorised ONIRIA administrator to review manually.</p>
        <Suspense fallback={<div className="adminLoading">Loading recovery form...</div>}>
          <ForgotEmailForm />
        </Suspense>
      </div>
    </main>
  );
}
