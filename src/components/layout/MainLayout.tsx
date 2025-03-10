import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100">
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4">
          <div className="navbar min-h-16">
            <div className="flex-1">
              <a className="text-2xl font-bold text-primary">ReadingRally</a>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
