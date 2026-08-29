import { Suspense } from 'react';
import AdminSupportPage from '@/components/admin/AdminSupportPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto" />
            <p className="text-slate-400 text-xs mt-3">Loading support console...</p>
          </div>
        </div>
      }
    >
      <AdminSupportPage />
    </Suspense>
  );
}
