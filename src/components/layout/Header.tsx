import React from 'react';
import { Button } from '../common';

export const Header: React.FC = () => {
  return (
    <header className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4">
        <div className="navbar min-h-16">
          <div className="flex-1">
            <a className="text-2xl font-bold text-primary">
              ReadingRally
            </a>
          </div>

          <div className="flex-none gap-4">
            <Button variant="ghost" size="sm">
              Dashboard
            </Button>
            <Button variant="ghost" size="sm">
              My Progress
            </Button>
            <Button variant="ghost" size="sm">
              Achievements
            </Button>
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
  );
};
