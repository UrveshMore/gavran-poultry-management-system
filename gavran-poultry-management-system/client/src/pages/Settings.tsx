import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Settings: React.FC = () => {
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your application settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Profile Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue="john@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input 
                type="tel" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                defaultValue="+91 9876543210"
              />
            </div>
            
            <div className="pt-4">
              <Button variant="primary">Save Changes</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
          
          <div className="space-y-4">
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Email notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">SMS notifications</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                <span className="ml-2 text-sm text-gray-700">Weekly reports</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Monthly summaries</span>
              </label>
            </div>
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">System Configuration</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Currency</label>
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>INR</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Language</label>
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>English</option>
              <option>Hindi</option>
              <option>Telugu</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>UTC +5:30 (IST)</option>
              <option>UTC +0 (GMT)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Data Retention</label>
            <select className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>6 months</option>
              <option>1 year</option>
              <option>2 years</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <Button variant="primary">Save Configuration</Button>
        </div>
      </Card>

      <Card className="mt-6 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Security</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Current Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter current password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <input 
              type="password" 
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Confirm new password"
            />
          </div>
          
          <div className="pt-4">
            <Button variant="primary">Update Password</Button>
          </div>
        </div>
      </Card>
    </Layout>
  );
};

export default Settings;