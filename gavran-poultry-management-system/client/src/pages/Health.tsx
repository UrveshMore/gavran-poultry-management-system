import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';

const Health: React.FC = () => {
  const healthData = [
    { id: 1, birdId: 'B001', batch: 'Batch A', condition: 'Healthy', treatment: 'None', lastUpdate: '2023-06-10' },
    { id: 2, birdId: 'B002', batch: 'Batch A', condition: 'Sick', treatment: 'Antibiotics', lastUpdate: '2023-06-08' },
    { id: 3, birdId: 'B003', batch: 'Batch B', condition: 'Healthy', treatment: 'None', lastUpdate: '2023-06-10' },
    { id: 4, birdId: 'B004', batch: 'Batch B', condition: 'Sick', treatment: 'Vaccination', lastUpdate: '2023-06-09' },
  ];

  const columns = [
    { key: 'birdId', title: 'Bird ID' },
    { key: 'batch', title: 'Batch' },
    { key: 'condition', title: 'Condition' },
    { key: 'treatment', title: 'Treatment' },
    { key: 'lastUpdate', title: 'Last Update' },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Health Monitoring</h1>
        <p className="text-gray-600">Track the health status of your poultry</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Healthy Birds</h2>
          <p className="text-3xl font-bold text-green-600">10,250</p>
          <p className="text-sm text-gray-500 mt-1">in good health</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Sick Birds</h2>
          <p className="text-3xl font-bold text-red-600">180</p>
          <p className="text-sm text-gray-500 mt-1">require attention</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Treatment Done</h2>
          <p className="text-3xl font-bold text-blue-600">52</p>
          <p className="text-sm text-gray-500 mt-1">treatments performed</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Vaccination Rate</h2>
          <p className="text-3xl font-bold text-purple-600">95%</p>
          <p className="text-sm text-gray-500 mt-1">full vaccination coverage</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Health Records</h2>
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
            {healthData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.birdId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.batch}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.condition === 'Healthy' ? 'bg-green-100 text-green-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {item.condition}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.treatment}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.lastUpdate}</td>
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

export default Health;