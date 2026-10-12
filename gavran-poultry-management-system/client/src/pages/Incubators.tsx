import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Badge from '../components/ui/Badge';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import EmptyState from '../components/ui/EmptyState';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';

const Incubators: React.FC = () => {
  const [incubators, setIncubators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingIncubator, setEditingIncubator] = useState<any>(null);
  const [formData, setFormData] = useState({
    farm_id: '',
    name: '',
    capacity: '',
    temperature: '',
    humidity: '',
    status: 'idle'
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchIncubators();
  }, []);

  const fetchIncubators = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/incubators', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIncubators(data.incubators);
      }
    } catch (error) {
      console.error('Error fetching incubators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this incubator?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/incubators/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchIncubators();
      }
    } catch (error) {
      console.error('Error deleting incubator:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = editingIncubator ? 'PUT' : 'POST';
      const url = editingIncubator 
        ? `http://localhost:5000/api/incubators/${editingIncubator.id}` 
        : 'http://localhost:5000/api/incubators';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity),
          temperature: formData.temperature ? parseFloat(formData.temperature) : null,
          humidity: formData.humidity ? parseFloat(formData.humidity) : null
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setEditingIncubator(null);
        setFormData({
          farm_id: '',
          name: '',
          capacity: '',
          temperature: '',
          humidity: '',
          status: 'idle'
        });
        fetchIncubators();
      }
    } catch (error) {
      console.error('Error saving incubator:', error);
    }
  };

  const handleEdit = (incubator: any) => {
    setEditingIncubator(incubator);
    setFormData({
      farm_id: incubator.farm_id || '',
      name: incubator.name,
      capacity: incubator.capacity.toString(),
      temperature: incubator.temperature ? incubator.temperature.toString() : '',
      humidity: incubator.humidity ? incubator.humidity.toString() : '',
      status: incubator.status
    });
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditingIncubator(null);
    setFormData({
      farm_id: '',
      name: '',
      capacity: '',
      temperature: '',
      humidity: '',
      status: 'idle'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Incubators</h1>
          {user?.role === 'owner' || user?.role === 'manager' ? (
            <Button onClick={() => setShowModal(true)}>Add Incubator</Button>
          ) : null}
        </div>

        {incubators.length === 0 ? (
          <EmptyState
            title="No Incubators Found"
            description="Get started by adding your first incubator."
            action={
              user?.role === 'owner' || user?.role === 'manager' ? (
                <Button onClick={() => setShowModal(true)}>Add Incubator</Button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incubators.map((incubator) => (
              <Card key={incubator.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{incubator.name}</h3>
                  <Badge className={getStatusColor(incubator.status)}>
                    {incubator.status.charAt(0).toUpperCase() + incubator.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Farm:</span> {incubator.farm_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Capacity:</span> {incubator.capacity}
                  </p>
                  {incubator.temperature && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Temperature:</span> {incubator.temperature}°C
                    </p>
                  )}
                  {incubator.humidity && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Humidity:</span> {incubator.humidity}%
                    </p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Current batch count: 0</span>
                  {user?.role === 'owner' || user?.role === 'manager' ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(incubator)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(incubator.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Incubator Modal */}
        <Modal isOpen={showModal} onClose={handleCancel} title={
          editingIncubator ? 'Edit Incubator' : 'Add New Incubator'
        }>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Incubator Name"
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
            <Input
              label="Temperature (°C)"
              type="number"
              step="0.1"
              value={formData.temperature}
              onChange={(e) => setFormData({...formData, temperature: e.target.value})}
            />
            <Input
              label="Humidity (%)"
              type="number"
              step="0.1"
              value={formData.humidity}
              onChange={(e) => setFormData({...formData, humidity: e.target.value})}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'idle', label: 'Idle' },
                { value: 'maintenance', label: 'Maintenance' }
              ]}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                {editingIncubator ? 'Update Incubator' : 'Add Incubator'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Incubators;