import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Eggs: React.FC = () => {
  const eggData = [
    { id: 1, date: '2023-06-10', batch: 'Batch A', quantity: 5480, price: 150 },
    { id: 2, date: '2023-06-09', batch: 'Batch B', quantity: 4820, price: 155 },
    { id: 3, date: '2023-06-08', batch: 'Batch A', quantity: 5200, price: 145 },
  ];
  
  const columns = [
    { key: 'date', title: 'Date' },
    { key: 'batch', title: 'Batch' },
    { key: 'quantity', title: 'Quantity (pcs)' },
    { key: 'price', title: 'Price (₹)' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Eggs</h1>
          <p className="text-gray-600">Manage egg production data</p>
        </div>
        <Button variant="primary" onClick={() => console.log('Add egg record')}>
          Add Record
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Today's Production</h2>
          <p className="text-3xl font-bold text-green-600">5,480</p>
          <p className="text-sm text-gray-500 mt-1">eggs today</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Avg. Egg Size</h2>
          <p className="text-3xl font-bold text-green-600">58g</p>
          <p className="text-sm text-gray-500 mt-1">large eggs</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Production Rate</h2>
          <p className="text-3xl font-bold text-green-600">92.5%</p>
          <p className="text-sm text-gray-500 mt-1">efficiency</p>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Egg Production Records</h2>
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
            {eggData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.batch}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <a href="#" className="text-green-600 hover:text-green-900 mr-3">Edit</a>
                  <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Layout>
  );
};

export default Eggs;