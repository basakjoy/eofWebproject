import { Suspense } from 'react';
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = 'force-dynamic';

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><div className="text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div><p className="text-gray-600 mt-4">Loading admin...</p></div></div>}>
      <AdminDashboard />
    </Suspense>
  );
}
