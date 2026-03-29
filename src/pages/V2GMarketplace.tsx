import { useState, useEffect, FormEvent } from "react";
import {
  TrendingUp,
  DollarSign,
  Leaf,
  MapPin,
  Battery,
  History,
} from "lucide-react";
import { Navigation } from "../components/Navigation";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import { navigate } from "../components/Router";
import type { EVCar, V2GTransaction, EnergyPrice } from "../types/database";

export function V2GMarketplace() {
  const { user } = useAuth();
  const [cars, setCars] = useState<EVCar[]>([]);
  const [selectedCar, setSelectedCar] = useState<EVCar | null>(null);
  const [transactions, setTransactions] = useState<V2GTransaction[]>([]);
  const [energyPrices, setEnergyPrices] = useState<EnergyPrice[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("New York");
  const [loading, setLoading] = useState(true);
  const [sellAmount, setSellAmount] = useState(0);

  useEffect(() => {
    if (user) {
      loadCars();
      loadTransactions();
      loadEnergyPrices();
    }
  }, [user, selectedLocation]);

  const loadCars = async () => {
    const { data } = await supabase
      .from("ev_cars")
      .select("*")
      .eq("user_id", user!.id);

    if (data && data.length > 0) {
      setCars(data);
      const activeCar = data.find((car) => car.is_active) || data[0];
      setSelectedCar(activeCar);
    }
    setLoading(false);
  };

  const loadTransactions = async () => {
    const { data } = await supabase
      .from("v2g_transactions")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setTransactions(data);
    }
  };

  const loadEnergyPrices = async () => {
    const { data } = await supabase
      .from("energy_prices")
      .select("*")
      .eq("location", selectedLocation)
      .order("timestamp", { ascending: false })
      .limit(24);

    if (data) {
      setEnergyPrices(data.reverse());
    }
  };

  const currentPrice =
    energyPrices.length > 0
      ? Number(energyPrices[energyPrices.length - 1].price_per_kwh)
      : 0.15;

  const handleSellEnergy = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedCar || sellAmount <= 0) return;

    const totalEarned = sellAmount * currentPrice;

    const { error } = await supabase.from("v2g_transactions").insert({
      user_id: user!.id,
      car_id: selectedCar.id,
      energy_sold: sellAmount,
      price_per_kwh: currentPrice,
      total_amount: totalEarned,
      status: "completed",
    });

    if (!error) {
      const newCharge =
        Number(selectedCar.current_charge) -
        (sellAmount / Number(selectedCar.battery_capacity)) * 100;
      await supabase
        .from("ev_cars")
        .update({ current_charge: Math.max(0, newCharge) })
        .eq("id", selectedCar.id);

      setSellAmount(0);
      loadTransactions();
      loadCars();
      alert(
        `Successfully sold ${sellAmount} kWh for $${totalEarned.toFixed(2)}`,
      );
    }
  };

  const totalEarnings = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + Number(t.total_amount), 0);

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
              Add your first EV to access the V2G marketplace
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          V2G Marketplace
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                LIVE
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${currentPrice.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Price per kWh</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {transactions.filter((t) => t.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Sell Energy
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Vehicle
              </label>
              <select
                value={selectedCar?.id || ""}
                onChange={(e) => {
                  const car = cars.find((c) => c.id === e.target.value);
                  setSelectedCar(car || null);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} -{" "}
                    {Number(car.current_charge).toFixed(0)}% charged
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Houston">Houston</option>
                  <option value="Phoenix">Phoenix</option>
                </select>
              </div>
            </div>

            {selectedCar && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Current Charge</span>
                  <span className="font-semibold text-gray-900">
                    {Number(selectedCar.current_charge).toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${selectedCar.current_charge}%` }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Available:{" "}
                  {(
                    (Number(selectedCar.battery_capacity) *
                      Number(selectedCar.current_charge)) /
                    100
                  ).toFixed(1)}{" "}
                  kWh
                </div>
              </div>
            )}

            <form onSubmit={handleSellEnergy} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Energy to Sell (kWh)
                </label>
                <input
                  type="number"
                  value={sellAmount}
                  onChange={(e) =>
                    setSellAmount(parseFloat(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  step="0.1"
                  min="0"
                  max={
                    selectedCar
                      ? (Number(selectedCar.battery_capacity) *
                          Number(selectedCar.current_charge)) /
                        100
                      : 0
                  }
                  placeholder="10.0"
                  required
                />
              </div>

              {sellAmount > 0 && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Estimated Earnings
                    </span>
                    <span className="text-xl font-bold text-green-600">
                      ${(sellAmount * currentPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedCar || sellAmount <= 0}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sell Energy to Grid
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Energy Price Chart (24h)
            </h3>

            <div className="relative h-64">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0%"
                    y1="0%"
                    x2="0%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {energyPrices.length > 0 && (
                  <>
                    <polyline
                      fill="url(#priceGradient)"
                      stroke="none"
                      points={
                        energyPrices
                          .map((price, i) => {
                            const x =
                              (i / (energyPrices.length - 1)) * 380 + 10;
                            const y =
                              180 - (Number(price.price_per_kwh) / 0.3) * 160;
                            return `${x},${y}`;
                          })
                          .join(" ") + " 390,180 10,180"
                      }
                    />
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      points={energyPrices
                        .map((price, i) => {
                          const x = (i / (energyPrices.length - 1)) * 380 + 10;
                          const y =
                            180 - (Number(price.price_per_kwh) / 0.3) * 160;
                          return `${x},${y}`;
                        })
                        .join(" ")}
                    />
                  </>
                )}

                <line
                  x1="10"
                  y1="180"
                  x2="390"
                  y2="180"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
                <line
                  x1="10"
                  y1="20"
                  x2="10"
                  y2="180"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              </svg>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-center">
              <div>
                <div className="text-gray-500">Low</div>
                <div className="font-semibold text-gray-900">
                  $
                  {Math.min(
                    ...energyPrices.map((p) => Number(p.price_per_kwh)),
                  ).toFixed(3)}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Avg</div>
                <div className="font-semibold text-gray-900">
                  $
                  {(
                    energyPrices.reduce(
                      (sum, p) => sum + Number(p.price_per_kwh),
                      0,
                    ) / energyPrices.length
                  ).toFixed(3)}
                </div>
              </div>
              <div>
                <div className="text-gray-500">High</div>
                <div className="font-semibold text-gray-900">
                  $
                  {Math.max(
                    ...energyPrices.map((p) => Number(p.price_per_kwh)),
                  ).toFixed(3)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <History className="h-5 w-5 mr-2 text-green-600" />
            Transaction History
          </h3>

          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No transactions yet. Start selling energy to the grid!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Energy Sold
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Price/kWh
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Total
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {new Date(
                          transaction.transaction_date,
                        ).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {Number(transaction.energy_sold).toFixed(1)} kWh
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        ${Number(transaction.price_per_kwh).toFixed(3)}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600">
                        ${Number(transaction.total_amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
