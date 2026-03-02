import React from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <header className='h-16 border-b border-gray-200 bg-white'>
        <div className='flex h-full items-center px-4 font-bold'>
          Lafenice Main Header
        </div>
      </header>

      <main className='flex-1'>
        {children}
      </main>

      <footer className='bg-gray-100 p-4 text-center text-sm text-gray-500'>
        © 2026 Lafenice. All rights reserved.
      </footer>
    </div>
  );
}