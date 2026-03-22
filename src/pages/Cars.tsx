import { useState, useEffect, FormEvent } from 'react';
import { Car, Plus, Trash2, CreditCard as Edit2, X } from 'lucide-react';
import { Navigation } from '../components/Navigation';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { EVCar } from '../types/database';

export function Cars() {
  const { user } = useAuth();
  const [cars, setCars] = useState<EVCar[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCar, setEditingCar] = useState<EVCar | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    battery_capacity: 0,
    purchase_price: 0,
    purchase_date: new Date().toISOString().split('T')[0],
    avg_kwh_per_km: 0.2,
  });

  useEffect(() => {
    if (user) {
      loadCars();
    }
  }, [user]);

  const loadCars = async () => {
    const { data } = await supabase
      .from('ev_cars')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (data) {
      setCars(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingCar) {
      await supabase
        .from('ev_cars')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingCar.id);
    } else {
      await supabase.from('ev_cars').insert({
        ...formData,
        user_id: user!.id,
        is_active: cars.length === 0,
      });
    }

    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      battery_capacity: 0,
      purchase_price: 0,
      purchase_date: new Date().toISOString().split('T')[0],
      avg_kwh_per_km: 0.2,
    });
    setShowAddForm(false);
    setEditingCar(null);
    loadCars();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this car?')) {
      await supabase.from('ev_cars').delete().eq('id', id);
      loadCars();
    }
  };

  const handleEdit = (car: EVCar) => {
    setEditingCar(car);
    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      battery_capacity: Number(car.battery_capacity),
      purchase_price: Number(car.purchase_price),
      purchase_date: car.purchase_date,
      avg_kwh_per_km: Number(car.avg_kwh_per_km),
    });
    setShowAddForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setEditingCar(null);
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      battery_capacity: 0,
      purchase_price: 0,
      purchase_date: new Date().toISOString().split('T')[0],
      avg_kwh_per_km: 0.2,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Vehicle</span>
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCar ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make
                    </label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Tesla"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Model 3"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      min="2010"
                      max={new Date().getFullYear() + 1}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Battery Capacity (kWh)
                    </label>
                    <input
                      type="number"
                      value={formData.battery_capacity}
                      onChange={(e) => setFormData({ ...formData, battery_capacity: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      step="0.1"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Price ($)
                    </label>
                    <input
                      type="number"
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Purchase Date
                    </label>
                    <input
                      type="date"
                      value={formData.purchase_date}
                      onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Average Efficiency (kWh/km)
                    </label>
                    <input
                      type="number"
                      value={formData.avg_kwh_per_km}
                      onChange={(e) => setFormData({ ...formData, avg_kwh_per_km: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                  >
                    {editingCar ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {cars.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Vehicles Yet</h3>
            <p className="text-gray-600">Add your first electric vehicle to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map(car => (
              <div
                key={car.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Car className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(car)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <Edit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(car.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {car.make} {car.model}
                </h3>
                <p className="text-gray-600 mb-4">{car.year}</p>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Battery</span>
                    <span className="font-medium text-gray-900">
                      {Number(car.battery_capacity).toFixed(0)} kWh
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency</span>
                    <span className="font-medium text-gray-900">
                      {Number(car.avg_kwh_per_km).toFixed(2)} kWh/km
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price</span>
                    <span className="font-medium text-gray-900">
                      ${Number(car.purchase_price).toFixed(2)}
                    </span>
                  </div>
                </div>

                {car.is_active && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      Active Vehicle
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
