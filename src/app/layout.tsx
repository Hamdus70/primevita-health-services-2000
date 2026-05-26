import React from 'react';
import { Providers } from './providers';
import { Toaster } from 'sonner';
import '@/index.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen flex-col">
            {children}
            <Toaster position="top-right" richColors />
          </div>
        </Providers>
      </body>
    </html>
  );
}
