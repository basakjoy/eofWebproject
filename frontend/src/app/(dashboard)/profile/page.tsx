'use client';

import Card from '@/components/common/Card';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Camera } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 text-sm">Update profile picture</p>
          </div>

          {/* Profile Form */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" defaultValue="John" />
              <Input label="Last Name" defaultValue="Doe" />
            </div>

            <Input label="Email Address" defaultValue="john@example.com" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" />
              <Input label="Location" placeholder="New York, USA" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows={4}
                placeholder="Tell us about yourself..."
              ></textarea>
            </div>

            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Account Settings */}
      <Card>
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <Button variant="outline">Enable</Button>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Change Password</p>
              <p className="text-sm text-gray-600">Update your password regularly</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>

          <div className="flex justify-between items-center p-4 border rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Delete Account</p>
              <p className="text-sm text-gray-600">Permanently delete your account</p>
            </div>
            <Button variant="danger">Delete</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
