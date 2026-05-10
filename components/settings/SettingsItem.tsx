import React from 'react';
import Link from 'next/link';
import { User, Bell, Lock, DollarSign, Globe } from 'lucide-react';

export const settingsSections = [
  { id: 'account', title: 'Account & Language', icon: User },
  { id: 'notifications', title: 'Notifications', icon: Bell },
  { id: 'payouts', title: 'Payouts & Fees', icon: DollarSign },
  { id: 'privacy', title: 'Privacy & Data', icon: Lock },
];

interface SettingsSidebarProps {
  activeSection: string;
  onSelect: (section: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeSection, onSelect }) => {
  return (
    <nav className="flex flex-col space-y-2 p-4 bg-white rounded-xl shadow-lg border border-gray-100 sticky top-20">
      {settingsSections.map((section) => {
        const isActive = activeSection === section.id;
        const Icon = section.icon;

        return (
          <button
            key={section.id}
            onClick={() => onSelect(section.id)}
            className={`
              flex items-center space-x-3 p-3 rounded-lg transition duration-150 text-left
              ${isActive 
                ? 'bg-teal-50 text-teal-700 font-semibold' 
                : 'text-gray-600 hover:bg-gray-50'
              }
            `}
          >
            <Icon className="w-5 h-5" />
            <span>{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
};
