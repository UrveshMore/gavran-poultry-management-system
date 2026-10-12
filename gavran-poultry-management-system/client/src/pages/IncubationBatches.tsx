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

const IncubationBatches: React.FC = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCandlingModal, setShowCandlingModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [formData, setFormData] = useState({
    incubator_id: '',
    eggs_loaded: '',
    source_shed_id: '',
    source_batch_id: '',
    start_date: '',
    status: 'pending'
  });
  const [candlingData, setCandlingData] = useState({
    day_no: '',
    fertile: '',
    infertile: '',
    dead: '',
    notes: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchIncubationBatches();
  }, []);

  const fetchIncubationBatches = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/incubation-batches', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBatches(data.batches);
      }
    } catch (error) {
      console.error('Error fetching incubation batches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this incubation batch?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/incubation-batches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        fetchIncubationBatches();
      }
    } catch (error) {
      console.error('Error deleting incubation batch:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/incubation-batches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...formData,
          eggs_loaded: parseInt(formData.eggs_loaded),
          incubator_id: parseInt(formData.incubator_id),
          source_shed_id: formData.source_shed_id ? parseInt(formData.source_shed_id) : null,
          source_batch_id: formData.source_batch_id ? parseInt(formData.source_batch_id) : null
        }),
      });

      if (response.ok) {
        setShowAddModal(false);
        setFormData({
          incubator_id: '',
          eggs_loaded: '',
          source_shed_id: '',
          source_batch_id: '',
          start_date: '',
          status: 'pending'
        });
        fetchIncubationBatches();
      }
    } catch (error) {
      console.error('Error creating incubation batch:', error);
    }
  };

  const handleCandlingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBatch) return;

    try {
      const response = await fetch(`http://localhost:5000/api/incubation-batches/${selectedBatch.id}/candling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...candlingData,
          day_no: parseInt(candlingData.day_no),
          fertile: parseInt(candlingData.fertile) || 0,
          infertile: parseInt(candlingData.infertile) || 0,
          dead: parseInt(candlingData.dead) || 0
        }),
      });

      if (response.ok) {
        setShowCandlingModal(false);
        setCandlingData({
          day_no: '',
          fertile: '',
          infertile: '',
          dead: '',
          notes: ''
        });
        fetchIncubationBatches();
      }
    } catch (error) {
      console.error('Error adding candling record:', error);
    }
  };

  const openCandlingModal = (batch: any) => {
    setSelectedBatch(batch);
    setShowCandlingModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'incubating': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCandlingRecordForDay = (batch: any, day: number) => {
    return batch.candling_records?.find((record: any) => record.day_no === day);
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
          <h1 className="text-2xl font-bold text-gray-900">Incubation Batches</h1>
          {user?.role === 'owner' || user?.role === 'manager' ? (
            <Button onClick={() => setShowAddModal(true)}>Add Batch</Button>
          ) : null}
        </div>

        {batches.length === 0 ? (
          <EmptyState
            title="No Incubation Batches"
            description="Create your first incubation batch to start tracking egg incubation."
            action={
              user?.role === 'owner' || user?.role === 'manager' ? (
                <Button onClick={() => setShowAddModal(true)}>Add Batch</Button>
              ) : null
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <Card key={batch.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Batch #{batch.batch_no}</h3>
                  <Badge className={getStatusColor(batch.status)}>
                    {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Incubator:</span> {batch.incubator_name}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Eggs Loaded:</span> {batch.eggs_loaded}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Start Date:</span> {batch.start_date}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Expected Hatch:</span> {batch.expected_hatch_date}
                  </p>
                  {batch.source_shed_name && (
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Source:</span> {batch.source_shed_name}
                    </p>
                  )}
                </div>

                {/* Progress Timeline */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Progress</h4>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Day 0</span>
                    <span>Day 7</span>
                    <span>Day 14</span>
                    <span>Day 21</span>
                  </div>
                  <div className="relative pt-1">
                    <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                      {Array.from({ length: 22 }).map((_, day) => (
                        <div 
                          key={day} 
                          className={`h-full flex-1 ${day <= 21 ? 'bg-blue-500' : 'bg-gray-300'}`}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-xs">{batch.candling_records?.length || 0}/3 candling records</span>
                      <span className="text-xs">21 days</span>
                    </div>
                  </div>
                </div>

                {/* Candling Records */}
                {batch.candling_records && batch.candling_records.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Candling Records</h4>
                    <div className="space-y-2">
                      {batch.candling_records.map((record: any) => (
                        <div key={record.id} className="text-xs text-gray-600">
                          <span className="font-medium">Day {record.day_no}:</span> F:{record.fertile}, I:{record.infertile}, D:{record.dead}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  {user?.role === 'owner' || user?.role === 'manager' ? (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => openCandlingModal(batch)}
                      >
                        Add Candling
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDelete(batch.id)}
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

        {/* Add Batch Modal */}
        <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Incubation Batch">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({...formData, start_date: e.target.value})}
              required
            />
            <Select
              label="Incubator"
              value={formData.incubator_id}
              onChange={(e) => setFormData({...formData, incubator_id: e.target.value})}
              options={[
                { value: '', label: 'Select Incubator' },
                // Dynamic options would come from API
              ]}
              required
            />
            <Input
              label="Eggs Loaded"
              type="number"
              value={formData.eggs_loaded}
              onChange={(e) => setFormData({...formData, eggs_loaded: e.target.value})}
              required
            />
            <Select
              label="Source Shed (Optional)"
              value={formData.source_shed_id}
              onChange={(e) => setFormData({...formData, source_shed_id: e.target.value})}
              options={[
                { value: '', label: 'Select Source Shed' },
                // Dynamic options would come from API
              ]}
            />
            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'incubating', label: 'Incubating' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Batch
              </Button>
            </div>
          </form>
        </Modal>

        {/* Candling Record Modal */}
        <Modal isOpen={showCandlingModal} onClose={() => setShowCandlingModal(false)} title={`Add Candling Record - Batch #${selectedBatch?.batch_no}`}>
          <form onSubmit={handleCandlingSubmit} className="space-y-4">
            <Input
              label="Day Number"
              type="number"
              value={candlingData.day_no}
              onChange={(e) => setCandlingData({...candlingData, day_no: e.target.value})}
              required
            />
            <Input
              label="Fertile"
              type="number"
              value={candlingData.fertile}
              onChange={(e) => setCandlingData({...candlingData, fertile: e.target.value})}
            />
            <Input
              label="Infertile"
              type="number"
              value={candlingData.infertile}
              onChange={(e) => setCandlingData({...candlingData, infertile: e.target.value})}
            />
            <Input
              label="Dead"
              type="number"
              value={candlingData.dead}
              onChange={(e) => setCandlingData({...candlingData, dead: e.target.value})}
            />
            <textarea
              label="Notes"
              value={candlingData.notes}
              onChange={(e) => setCandlingData({...candlingData, notes: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              rows={3}
            />
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setShowCandlingModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Add Candling Record
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default IncubationBatches;