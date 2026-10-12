import React from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Table from '../components/ui/Table';
import { Link } from 'react-router-dom';

// Dummy data for batches
const batchData = [
  {
    id: 1,
    name: 'Batch A',
    type: 'Broilers',
    status: 'Active',
    startDate: '2023-05-15',
    endDate: '2023-07-15',
    birds: 5000,
    mortality: '1.2%',
  },
  {
    id: 2,
    name: 'Batch B',
    type: 'Laying Hens',
    status: 'Active',
    startDate: '2023-06-01',
    endDate: '2023-12-01',
    birds: 3000,
    mortality: '0.8%',
  },
  {
    id: 3,
    name: 'Batch C',
    type: 'Broilers',
    status: 'Completed',
    startDate: '2023-04-10',
    endDate: '2023-06-10',
    birds: 4500,
    mortality: '1.5%',
  },
];

const Batches: React.FC = () => {
  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'type', title: 'Type' },
    { key: 'status', title: 'Status' },
    { key: 'startDate', title: 'Start Date' },
    { key: 'endDate', title: 'End Date' },
    { key: 'birds', title: 'Birds' },
    { key: 'mortality', title: 'Mortality Rate' },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
          <p className="text-gray-600">Manage your poultry batches</p>
        </div>
        <Button variant="primary" onClick={() => console.log('Create new batch')}>
          Add Batch
        </Button>
      </div>

      <Card className="p-6">
        <Table 
          data={batchData} 
          columns={columns} 
          onRowClick={(row) => console.log('Row clicked:', row)}
        />
      </Card>
      
      <div className="mt-6 flex justify-center">
        <Button variant="secondary" onClick={() => console.log('Load more')}>
          Load More
        </Button>
      </div>
    </Layout>
  );
};

export default Batches;