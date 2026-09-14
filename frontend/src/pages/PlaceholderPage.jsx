import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Hammer } from 'lucide-react';

export default function PlaceholderPage({ title }) {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
        <div className="bg-blue-50 p-6 rounded-full mb-6">
          <Hammer className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-500 max-w-md">
          This section is currently under construction. Please check back later when new features are released.
        </p>
      </div>
    </MainLayout>
  );
}
