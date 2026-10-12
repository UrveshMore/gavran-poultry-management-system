import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import { useAuth } from '../context/AuthContext';

const Farms: React.FC = () => {
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/farms', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFarms(data.farms);
      }
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this farm?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/farms/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchFarms();
      }
    } catch (error) {
      console.error('Error deleting farm:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingFarm ? 'PUT' : 'POST';
      const url = editingFarm 
        ? `http://localhost:5000/api/farms/${editingFarm.id}` 
        : 'http://localhost:5000/api/farms';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowForm(false);
        setEditingFarm(null);
        setFormData({ name: '', address: '' });
        fetchFarms();
      }
    } catch (error) {
      console.error('Error saving farm:', error);
    }
  };

  const handleEdit = (farm: any) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      address: farm.address || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
    setFormData({ name: '', address: '' });
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Farms</h1>
          {user?.role === 'owner' || user?.role === 'manager' ? (
            <Button onClick={() => setShowForm(true)}>Add Farm</Button>
          ) : null}
        </div>

        {showForm && (
          <Card className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {editingFarm ? 'Edit Farm' : 'Add New Farm'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Farm Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input
                label="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                placeholder="Enter farm address"
              />
              <div className="flex space-x-3">
                <Button type="submit" variant="primary">
                  {editingFarm ? 'Update Farm' : 'Add Farm'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {farms.length === 0 ? (
          <EmptyState
            title="No Farms Found"
            description="Get started by adding your first farm."
            action={
              user?.role === 'owner' || user?.role === 'manager' ? (
                <Button onClick={() => setShowForm(true)}>Add Farm</Button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farms.map((farm) => (
              <Card key={farm.id} className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{farm.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{farm.address}</p>
                <p className="text-xs text-gray-400 mb-4">Owner: {farm.owner_name}</p>
                <div className="flex justify-end space-x-2">
                  {user?.role === 'owner' || user?.role === 'manager' ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(farm)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(farm.id)}
                      >
                        Delete
                      </Button>
                    </>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Farms;