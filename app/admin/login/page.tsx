import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
      <AdminLoginClient />
    </Suspense>
  );
}
