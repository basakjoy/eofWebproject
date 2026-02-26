'use client';

import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import { Bell, Mail, Smartphone, Lock } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your preferences</p>
      </div>

      {/* Notification Settings */}
      <Card>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell className="w-6 h-6" />
          Notification Settings
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates via email</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Signal Alerts</p>
              <p className="text-sm text-gray-600">Get notified for new signals</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Deposit Notifications</p>
              <p className="text-sm text-gray-600">Updates on your investments</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-600">New features and promotions</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lock className="w-6 h-6" />
          Privacy & Security
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Profile Visibility</p>
              <p className="text-sm text-gray-600">Make profile public or private</p>
            </div>
            <select className="border rounded px-3 py-1">
              <option>Private</option>
              <option>Public</option>
            </select>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Enhance account security</p>
            </div>
            <Button variant="outline" size="sm">Enable</Button>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Active Sessions</p>
              <p className="text-sm text-gray-600">Manage your login sessions</p>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </div>
      </Card>

      {/* Theme Settings */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">Preferences</h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-gray-600">Light or dark mode</p>
            </div>
            <select className="border rounded px-3 py-1">
              <option>Light</option>
              <option>Dark</option>
              <option>Auto</option>
            </select>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium">Language</p>
              <p className="text-sm text-gray-600">Select your preferred language</p>
            </div>
            <select className="border rounded px-3 py-1">
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
