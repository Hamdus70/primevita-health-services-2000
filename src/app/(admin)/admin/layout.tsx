import React from 'react';
import { redirect } from 'next/navigation';
// import { auth } from '@/auth'; // Hypothetical auth check once configured

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();
  // if (!session || session.user.role !== 'ADMIN') redirect('/signin');
  
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b p-4">
        <h1 className="font-bold text-lg">Admin Control System</h1>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
