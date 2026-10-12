import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Incubators: React.FC = () => {
  const incubatorData = [
    { id: 1, name: 'Incubator A', status: 'Active', capacity: 5000, temperature: '37.8°C', humidity: '65%', eggs: 4800 },
    { id: 2, name: 'Incubator B', status: 'Idle', capacity: 4000, temperature: 'N/A', humidity: 'N/A', eggs: 0 },
    { id: 3, name: 'Incubator C', status: 'Maintenance', capacity: 6000, temperature: 'N/A', humidity: 'N/A', eggs: 0 },
  ];

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'status', title: 'Status' },
    { key: 'capacity', title: 'Capacity' },
    { key: 'temperature', title: 'Temp' },
    { key: 'humidity', title: 'Humidity' },
    { key: 'eggs', title: 'Eggs in Progress' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incubators</h1>
          <p className="text-gray-600">Manage your incubation units</p>
        </div>
        <Button variant="primary" onClick={() => console.log('Add incubator')}>
          Add Incubator
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Total Incubators</h2>
          <p className="text-3xl font-bold text-green-600">18</p>
          <p className="text-sm text-gray-500 mt-1">active units</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Eggs in Progress</h2>
          <p className="text-3xl font-bold text-green-600">10,500</p>
          <p className="text-sm text-gray-500 mt-1">currently being incubated</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Success Rate</h2>
          <p className="text-3xl font-bold text-green-600">95.2%</p>
          <p className="text-sm text-gray-500 mt-1">incubation success</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Incubator Status</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th key={column.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.title}
                </th>
              ))}
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {incubatorData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.status === 'Active' ? 'bg-green-100 text-green-800' : 
                    item.status === 'Idle' ? 'bg-gray-100 text-gray-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.capacity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.temperature}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.humidity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.eggs}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-green-600 hover:text-green-900 mr-3">View</a>
                  <a href="#" className="text-gray-600 hover:text-gray-900">Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Layout>
  );
};

export default Incubators;