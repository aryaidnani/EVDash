import { useState, useEffect, FormEvent } from "react";
import {
  TrendingUp,
  DollarSign,
  Zap,
  MapPin,
  Battery,
  History,
  ChevronDown,
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
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

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

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
  ];

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            V2G Marketplace
          </h1>
          <p className="text-gray-600">
            Monitor real-time energy prices and sell power back to the grid
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                LIVE
              </span>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              ${currentPrice.toFixed(3)}
            </div>
            <div className="text-sm text-gray-600">Price per kWh</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              ${totalEarnings.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {transactions.filter((t) => t.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
                Energy Price Forecast
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                24-hour pricing trends for {selectedLocation}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <button
                onClick={() =>
                  setIsLocationDropdownOpen(!isLocationDropdownOpen)
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between text-gray-700 font-medium"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  {selectedLocation}
                </div>
                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform ${isLocationDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => {
                        setSelectedLocation(location);
                        setIsLocationDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors ${
                        selectedLocation === location
                          ? "bg-green-50 text-green-600 font-semibold"
                          : "text-gray-700"
                      } first:rounded-t-lg last:rounded-b-lg`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative h-80 bg-gradient-to-b from-green-50 to-transparent rounded-lg p-6 border border-green-100">
            <svg
              className="w-full h-full"
              viewBox="0 0 400 200"
              preserveAspectRatio="none"
            >
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
                          const x = (i / (energyPrices.length - 1)) * 380 + 10;
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
                    strokeWidth="3"
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
                stroke="#d1d5db"
                strokeWidth="1"
              />
              <line
                x1="10"
                y1="20"
                x2="10"
                y2="180"
                stroke="#d1d5db"
                strokeWidth="1"
              />
            </svg>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 font-medium mb-1">
                24h Low
              </div>
              <div className="text-2xl font-bold text-gray-900">
                $
                {Math.min(
                  ...energyPrices.map((p) => Number(p.price_per_kwh)),
                ).toFixed(3)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-200">
              <div className="text-xs text-green-700 font-medium mb-1">
                Average
              </div>
              <div className="text-2xl font-bold text-green-600">
                $
                {(
                  energyPrices.reduce(
                    (sum, p) => sum + Number(p.price_per_kwh),
                    0,
                  ) / energyPrices.length
                ).toFixed(3)}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-600 font-medium mb-1">
                24h High
              </div>
              <div className="text-2xl font-bold text-gray-900">
                $
                {Math.max(
                  ...energyPrices.map((p) => Number(p.price_per_kwh)),
                ).toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Sell Energy
            </h2>

            <div className="space-y-8">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Vehicle
                </label>
                <div className="relative">
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
                            {Number(selectedCar.current_charge).toFixed(0)}%
                            charged
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Select a vehicle</span>
                    )}
                    <ChevronDown
                      className={`h-5 w-5 text-gray-400 transition-transform ${isCarDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isCarDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                      {cars.map((car, idx) => (
                        <button
                          key={car.id}
                          onClick={() => {
                            setSelectedCar(car);
                            setIsCarDropdownOpen(false);
                          }}
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
                              {Number(car.current_charge).toFixed(0)}% •{" "}
                              {Number(car.battery_capacity).toFixed(0)} kWh
                              capacity
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

              {selectedCar && (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-transparent border border-green-200 rounded-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm font-semibold text-gray-900">
                        Battery Status
                      </span>
                      <span className="font-bold text-green-600 text-lg">
                        {Number(selectedCar.current_charge).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-green-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedCar.current_charge}%` }}
                      />
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      Available to sell:{" "}
                      {(
                        (Number(selectedCar.battery_capacity) *
                          Number(selectedCar.current_charge)) /
                        100
                      ).toFixed(1)}{" "}
                      kWh
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Energy to Sell
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellAmount}
                    onChange={(e) =>
                      setSellAmount(parseFloat(e.target.value) || 0)
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-lg"
                    step="0.1"
                    min="0"
                    max={
                      selectedCar
                        ? (Number(selectedCar.battery_capacity) *
                            Number(selectedCar.current_charge)) /
                          100
                        : 0
                    }
                    placeholder="Enter amount in kWh"
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                    kWh
                  </span>
                </div>
              </div>

              {sellAmount > 0 && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-25 border-2 border-green-200 rounded-xl">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-xs text-gray-600 font-medium mb-1">
                        Rate
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        ${currentPrice.toFixed(3)}/kWh
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-600 font-medium mb-1">
                        Estimated Earnings
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${(sellAmount * currentPrice).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSellEnergy}>
                <button
                  type="submit"
                  disabled={!selectedCar || sellAmount <= 0}
                  className="w-full px-6 py-4 bg-green-600 text-white text-lg rounded-xl hover:bg-green-700 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 shadow-lg hover:shadow-xl"
                >
                  Sell Energy to Grid
                </button>
              </form>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-lg p-8 text-white h-fit">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Stats
            </h3>
            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-green-100 mb-1">Sellable Now</div>
                <div className="text-3xl font-bold">
                  {selectedCar
                    ? (
                        (Number(selectedCar.battery_capacity) *
                          Number(selectedCar.current_charge)) /
                        100
                      ).toFixed(1)
                    : "0"}{" "}
                  kWh
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-green-100 mb-1">Max Potential</div>
                <div className="text-3xl font-bold">
                  {selectedCar
                    ? Number(selectedCar.battery_capacity).toFixed(0)
                    : "0"}{" "}
                  kWh
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur">
                <div className="text-sm text-green-100 mb-1">
                  Peak Rate Today
                </div>
                <div className="text-3xl font-bold">
                  $
                  {Math.max(
                    ...energyPrices.map((p) => Number(p.price_per_kwh)),
                  ).toFixed(3)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <History className="h-6 w-6 text-green-600" />
              Transaction History
            </h3>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <Zap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No transactions yet.</p>
              <p className="text-gray-500">Start selling energy to the grid!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Energy Sold
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Price/kWh
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, idx) => (
                    <tr
                      key={transaction.id}
                      className={`border-b border-gray-100 hover:bg-green-50 transition-colors ${idx === transactions.length - 1 ? "" : ""}`}
                    >
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {new Date(
                          transaction.transaction_date,
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-6 text-sm font-semibold text-gray-900">
                        {Number(transaction.energy_sold).toFixed(1)} kWh
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        ${Number(transaction.price_per_kwh).toFixed(3)}
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-green-600">
                        ${Number(transaction.total_amount).toFixed(2)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
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
