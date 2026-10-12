import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import Table from '../components/ui/Table';
import { useAuth } from '../context/AuthContext';

const Sheds: React.FC = () => {
  const [sheds, setSheds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShed, setEditingShed] = useState<any>(null);
  const [formData, setFormData] = useState({
    farm_id: '',
    name: '',
    capacity: '',
    type: 'broiler',
    status: 'active'
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchSheds();
  }, []);

  const fetchSheds = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/sheds', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSheds(data.sheds);
      }
    } catch (error) {
      console.error('Error fetching sheds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this shed?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/sheds/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchSheds();
      }
    } catch (error) {
      console.error('Error deleting shed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingShed ? 'PUT' : 'POST';
      const url = editingShed 
        ? `http://localhost:5000/api/sheds/${editingShed.id}` 
        : 'http://localhost:5000/api/sheds';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity)
        }),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingShed(null);
        setFormData({
          farm_id: '',
          name: '',
          capacity: '',
          type: 'broiler',
          status: 'active'
        });
        fetchSheds();
      }
    } catch (error) {
      console.error('Error saving shed:', error);
    }
  };

  const handleEdit = (shed: any) => {
    setEditingShed(shed);
    setFormData({
      farm_id: shed.farm_id || '',
      name: shed.name,
      capacity: shed.capacity.toString(),
      type: shed.type,
      status: shed.status
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingShed(null);
    setFormData({
      farm_id: '',
      name: '',
      capacity: '',
      type: 'broiler',
      status: 'active'
    });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'farm_name', label: 'Farm' },
    { key: 'capacity', label: 'Capacity' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
  ];

  // Prepare data for table
  const tableData = sheds.map(shed => ({
    ...shed,
    capacity: shed.capacity.toLocaleString(),
    type: shed.type.charAt(0).toUpperCase() + shed.type.slice(1),
    status: shed.status.charAt(0).toUpperCase() + shed.status.slice(1)
  }));

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SkeletonLoader count={5} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sheds</h1>
          {user?.role === 'owner' || user?.role === 'manager' ? (
            <Button onClick={() => setShowForm(true)}>Add Shed</Button>
          ) : null}
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingShed ? 'Edit Shed' : 'Add New Shed'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Shed Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                required
              />
              <Select
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                options={[
                  { value: 'broiler', label: 'Broiler' },
                  { value: 'layer', label: 'Layer' },
                  { value: 'breeding', label: 'Breeding' }
                ]}
              />
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'maintenance', label: 'Maintenance' }
                ]}
              />
              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  {editingShed ? 'Update Shed' : 'Add Shed'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {sheds.length === 0 ? (
          <EmptyState
            title="No Sheds Found"
            description="Get started by adding your first shed."
            action={
              user?.role === 'owner' || user?.role === 'manager' ? (
                <Button onClick={() => setShowForm(true)}>Add Shed</Button>
              ) : null
            }
          />
        ) : (
          <>
            {/* Mobile View - Card List */}
            <div className="md:hidden space-y-4 mb-6">
              {sheds.map((shed) => (
                <Card key={shed.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{shed.name}</h3>
                      <p className="text-sm text-gray-500">Farm: {shed.farm_name}</p>
                      <p className="text-sm text-gray-500">Capacity: {shed.capacity}</p>
                      <p className="text-sm text-gray-500">Type: {shed.type}</p>
                      <p className="text-sm text-gray-500">Status: {shed.status}</p>
                    </div>
                    {user?.role === 'owner' || user?.role === 'manager' ? (
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(shed)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleDelete(shed.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block">
              <Table 
                data={tableData} 
                columns={columns}
                actions={
                  user?.role === 'owner' || user?.role === 'manager'
                    ? (shed: any) => (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(shed)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleDelete(shed.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )
                    : undefined
                }
              />
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Sheds;