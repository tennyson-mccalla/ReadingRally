import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-base-200 py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-sm">
            © {new Date().getFullYear()} ReadingRally. All rights reserved.
          </div>
          <div className="flex gap-4 text-sm">
            <a href="#" className="link link-hover">Help</a>
            <a href="#" className="link link-hover">Privacy</a>
            <a href="#" className="link link-hover">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
