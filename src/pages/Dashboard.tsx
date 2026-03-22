import { useState, useEffect } from "react";
import {
  TrendingUp,
  Leaf,
  DollarSign,
  Calendar,
  Battery,
  Zap,
  MapPin,
  ChevronDown,
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
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);

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

  const handleCarChange = async (car: EVCar) => {
    await supabase
      .from("ev_cars")
      .update({ is_active: false })
      .eq("user_id", user!.id);

    await supabase.from("ev_cars").update({ is_active: true }).eq("id", car.id);

    setSelectedCar(car);
    setIsCarDropdownOpen(false);
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
  const dailySavings = daysOwned > 0 ? stats.totalSaved / daysOwned : 0;

  const breakEvenDays =
    selectedCar && dailySavings > 0
      ? Math.ceil(Number(selectedCar.purchase_price) / dailySavings)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              Track your EV usage and environmental impact
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <button
              onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-xl hover:border-green-200 hover:bg-green-50 transition-all flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {selectedCar ? (
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                    <Battery className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {selectedCar.make} {selectedCar.model}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedCar.year}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Select a vehicle</span>
              )}
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ${isCarDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isCarDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                {cars.map((car, idx) => (
                  <button
                    key={car.id}
                    onClick={() => handleCarChange(car)}
                    className={`w-full text-left px-4 py-4 flex items-center gap-3 hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                      selectedCar?.id === car.id ? "bg-green-50" : ""
                    } ${idx === 0 ? "rounded-t-lg" : ""} ${idx === cars.length - 1 ? "rounded-b-lg" : ""}`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Battery className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {car.make} {car.model}
                      </div>
                      <div className="text-sm text-gray-600">
                        {car.year} • {Number(car.battery_capacity).toFixed(0)}{" "}
                        kWh
                      </div>
                    </div>
                    <div
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        car.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {car.is_active ? "Active" : "Inactive"}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              ${stats.totalSaved.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Cost Saved</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {stats.totalDistance.toFixed(0)} km
            </div>
            <div className="text-sm text-gray-600">Distance Driven</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {stats.totalEnergy.toFixed(1)} kWh
            </div>
            <div className="text-sm text-gray-600">Energy Consumed</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {stats.totalCO2.toFixed(1)} kg
            </div>
            <div className="text-sm text-gray-600">CO₂ Saved</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <Leaf className="h-6 w-6 text-green-600" />
              Environmental Impact
            </h2>

            <div className="space-y-8">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {treesEquivalent}
                  </div>
                  <p className="text-lg text-gray-700 font-semibold">
                    Trees Planted Equivalent
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on CO₂ reduction
                  </p>
                </div>

                <div className="relative h-96 bg-white rounded-lg p-4 overflow-hidden border border-green-100">
                  <div className="flex flex-wrap gap-3 justify-center items-end h-full content-end">
                    {Array.from({ length: Math.min(treesEquivalent, 40) }).map(
                      (_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center animate-in fade-in duration-500"
                          style={{
                            animationDelay: `${i * 50}ms`,
                          }}
                        >
                          <svg
                            className="w-8 h-12 text-green-600 drop-shadow"
                            viewBox="0 0 24 32"
                            fill="currentColor"
                          >
                            <path d="M12 2 L8 10 L2 10 L8 14 L5 24 L12 18 L19 24 L16 14 L22 10 L16 10 Z" />
                            <rect
                              x="11"
                              y="20"
                              width="2"
                              height="12"
                              fill="#8B6F47"
                            />
                          </svg>
                        </div>
                      ),
                    )}

                    {treesEquivalent > 40 && (
                      <div className="absolute bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">
                        +{treesEquivalent - 40} more
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-xs text-gray-600 font-medium mb-1">
                      CO₂ Saved
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {stats.totalCO2.toFixed(0)} kg
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-xs text-gray-600 font-medium mb-1">
                      Equivalent to
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {(stats.totalCO2 / 20).toFixed(1)} trees
                    </div>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-green-100">
                    <div className="text-xs text-gray-600 font-medium mb-1">
                      Impact
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {Math.round(
                        (stats.totalCO2 / stats.totalDistance) * 100,
                      ) || 0}
                      g/km
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                    <Zap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Environmental Achievement
                    </h3>
                    <p className="text-sm text-gray-700">
                      Your EV has prevented {stats.totalCO2.toFixed(0)} kg of
                      CO₂ emissions! That's equivalent to planting{" "}
                      {treesEquivalent} trees or driving a gas car for{" "}
                      {Math.round(stats.totalDistance * 0.2)} km.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl shadow-lg p-8 text-white h-fit">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Breakeven Status
            </h3>

            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-green-100 mb-2">
                  Purchase Price
                </div>
                <div className="text-3xl font-bold">
                  $
                  {selectedCar
                    ? Number(selectedCar.purchase_price).toLocaleString()
                    : "0"}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-green-100 mb-2">Already Saved</div>
                <div className="text-3xl font-bold">
                  ${stats.totalSaved.toFixed(2)}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-green-100 mb-2">Days Owned</div>
                <div className="text-3xl font-bold">{daysOwned}</div>
              </div>

              <div className="border-t border-white border-opacity-20 pt-6">
                <div className="text-sm text-green-100 mb-2">
                  Estimated Breakeven
                </div>
                <div className="text-4xl font-bold mb-2">
                  {breakEvenDays > 0
                    ? `${breakEvenDays} days`
                    : "Calculating..."}
                </div>
                {breakEvenDays > daysOwned && (
                  <div className="text-sm text-green-100">
                    {breakEvenDays - daysOwned} days remaining
                  </div>
                )}
                {breakEvenDays <= daysOwned && breakEvenDays > 0 && (
                  <div className="text-sm text-green-200 font-semibold">
                    Already broken even!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Recent Activity
            </h3>

            {energyData.length === 0 ? (
              <div className="text-center py-12">
                <Battery className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 text-lg">
                  No activity recorded yet
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {energyData.slice(0, 8).map((entry, idx) => (
                  <div
                    key={entry.id}
                    className={`flex justify-between items-center p-4 rounded-lg border transition-colors ${
                      idx === 0
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-gray-900">
                        {Number(entry.distance_km).toFixed(1)} km trip
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(entry.recorded_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">
                        ${Number(entry.cost_saved).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {Number(entry.energy_consumed).toFixed(1)} kWh
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Battery className="h-6 w-6 text-green-600" />
              Vehicle Info
            </h3>

            {selectedCar && (
              <div className="space-y-5">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-2">
                    Battery Capacity
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Number(selectedCar.battery_capacity).toFixed(0)} kWh
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-2">
                    Current Charge
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-500 h-2 rounded-full"
                        style={{ width: `${selectedCar.current_charge}%` }}
                      />
                    </div>
                    <div className="text-xl font-bold text-gray-900">
                      {Number(selectedCar.current_charge).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-2">
                    Efficiency
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Number(selectedCar.avg_kwh_per_km).toFixed(2)} kWh/km
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 font-medium mb-2">
                    Purchase Date
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {new Date(selectedCar.purchase_date).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
