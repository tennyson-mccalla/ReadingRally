import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-base-100">
      <header className="bg-base-100 shadow-md">
        <div className="container mx-auto px-4">
          <div className="navbar min-h-16">
            <div className="flex-1">
              <Link to="/" className="text-2xl font-bold text-primary">
                ReadingRally
              </Link>
            </div>
            <div className="flex-none gap-2">
              <Link to="/">
                <Button
                  variant={isActive('/') ? 'primary' : 'ghost'}
                  size="sm"
                >
                  Dashboard
                </Button>
              </Link>
              <Link to="/reading">
                <Button
                  variant={isActive('/reading') ? 'primary' : 'ghost'}
                  size="sm"
                >
                  Start Reading
                </Button>
              </Link>
              <Link to="/progress">
                <Button
                  variant={isActive('/progress') ? 'primary' : 'ghost'}
                  size="sm"
                >
                  My Progress
                </Button>
              </Link>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                    <span className="text-lg font-bold">JS</span>
                  </div>
                </label>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li><a>Profile</a></li>
                  <li><a>Settings</a></li>
                  <li><a>Logout</a></li>
                </ul>
              </div>
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
