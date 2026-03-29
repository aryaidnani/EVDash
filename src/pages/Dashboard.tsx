import { useState, useEffect } from "react";
import {
  TrendingUp,
  Leaf,
  DollarSign,
  Calendar,
  Battery,
  Zap,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { navigate } from "../components/Router";
import type { EVCar, EnergyUsage } from "../types/database";

export function Dashboard() {
  const { user } = useAuth();
  const [cars, setCars] = useState<EVCar[]>([]);
  const [selectedCar, setSelectedCar] = useState<EVCar | null>(null);
  const [energyData, setEnergyData] = useState<EnergyUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCars();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCar) {
      loadEnergyData();
    }
  }, [selectedCar]);

  const loadCars = async () => {
    const { data, error } = await supabase
      .from("ev_cars")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (data && data.length > 0) {
      setCars(data);
      const activeCar = data.find((car) => car.is_active) || data[0];
      setSelectedCar(activeCar);
    }
    setLoading(false);
  };

  const loadEnergyData = async () => {
    if (!selectedCar) return;

    const { data } = await supabase
      .from("energy_usage")
      .select("*")
      .eq("car_id", selectedCar.id)
      .order("recorded_at", { ascending: false })
      .limit(30);

    if (data) {
      setEnergyData(data);
    }
  };

  const handleCarChange = async (carId: string) => {
    const car = cars.find((c) => c.id === carId);
    if (car) {
      await supabase
        .from("ev_cars")
        .update({ is_active: false })
        .eq("user_id", user!.id);

      await supabase
        .from("ev_cars")
        .update({ is_active: true })
        .eq("id", carId);

      setSelectedCar(car);
    }
  };

  const stats = {
    totalSaved: energyData.reduce(
      (sum, entry) => sum + Number(entry.cost_saved),
      0,
    ),
    totalCO2: energyData.reduce(
      (sum, entry) => sum + Number(entry.co2_saved),
      0,
    ),
    totalDistance: energyData.reduce(
      (sum, entry) => sum + Number(entry.distance_km),
      0,
    ),
    totalEnergy: energyData.reduce(
      (sum, entry) => sum + Number(entry.energy_consumed),
      0,
    ),
  };

  const treesEquivalent = Math.floor(stats.totalCO2 / 20);
  const daysOwned = selectedCar
    ? Math.floor(
        (new Date().getTime() - new Date(selectedCar.purchase_date).getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 0;
  const breakEvenDays =
    selectedCar && stats.totalSaved > 0
      ? Math.ceil(
          (Number(selectedCar.purchase_price) / stats.totalSaved) * daysOwned,
        )
      : 0;

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

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Battery className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Cars Added
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first EV to start tracking your savings
            </p>
            <button
              onClick={() => navigate("/cars")}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
            >
              Add Your First Car
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard</h1>

          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              Select Vehicle:
            </label>
            <select
              value={selectedCar?.id || ""}
              onChange={(e) => handleCarChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            >
              {cars.map((car) => (
                <option key={car.id} value={car.id}>
                  {car.make} {car.model} ({car.year})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${stats.totalSaved.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Cost Saved</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {treesEquivalent}
            </div>
            <div className="text-sm text-gray-600">Trees Equivalent</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalDistance.toFixed(0)} km
            </div>
            <div className="text-sm text-gray-600">Distance Driven</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats.totalEnergy.toFixed(1)} kWh
            </div>
            <div className="text-sm text-gray-600">Energy Consumed</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Breakeven Projection
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Purchase Price</span>
                <span className="font-semibold text-gray-900">
                  $
                  {selectedCar
                    ? Number(selectedCar.purchase_price).toFixed(2)
                    : "0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Saved</span>
                <span className="font-semibold text-green-600">
                  ${stats.totalSaved.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Days Owned</span>
                <span className="font-semibold text-gray-900">{daysOwned}</span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-gray-900">
                    Estimated Breakeven
                  </span>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {breakEvenDays > 0
                    ? `${breakEvenDays} days`
                    : "Calculating..."}
                </div>
                {breakEvenDays > daysOwned && (
                  <p className="text-sm text-gray-600 mt-2">
                    {breakEvenDays - daysOwned} days remaining
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {energyData.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {Number(entry.distance_km).toFixed(1)} km
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.recorded_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">
                      ${Number(entry.cost_saved).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Number(entry.energy_consumed).toFixed(1)} kWh
                    </div>
                  </div>
                </div>
              ))}
              {energyData.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No activity recorded yet
                </div>
              )}
            </div>
          </div>
        </div>

        {selectedCar && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Vehicle Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Battery Capacity
                </div>
                <div className="font-semibold text-gray-900">
                  {Number(selectedCar.battery_capacity).toFixed(0)} kWh
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Charge</div>
                <div className="font-semibold text-gray-900">
                  {Number(selectedCar.current_charge).toFixed(0)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Efficiency</div>
                <div className="font-semibold text-gray-900">
                  {Number(selectedCar.avg_kwh_per_km).toFixed(2)} kWh/km
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Purchase Date</div>
                <div className="font-semibold text-gray-900">
                  {new Date(selectedCar.purchase_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
