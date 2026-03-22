import {
  Leaf,
  TrendingUp,
  Battery,
  DollarSign,
  BarChart3,
  Activity,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { navigate } from "../components/Router";

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-transparent p-2.5 rounded-xl shadow-lg">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                EVDash
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Benefits
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
              >
                Pricing
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-700 hover:text-gray-900 font-semibold transition-colors px-4 py-2"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:shadow-lg font-semibold transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <Activity className="h-4 w-4" />
              <span>Smart EV Energy Management Platform</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Optimize Your EV's
              <br />
              <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                Energy Potential
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Comprehensive usage tracking, intelligent analytics, and
              location-specific V2G marketplace to maximize your electric
              vehicle investment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg rounded-xl hover:shadow-xl font-semibold transition-all hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 text-lg rounded-xl hover:border-gray-300 font-semibold transition-all">
                Watch Demo
              </button>
            </div>
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span>14-day free trial</span>
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="bg-gradient-to-b from-gray-50 to-white py-24"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything You Need in One Platform
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Powerful tools designed to help you make the most of your
                electric vehicle
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-600 hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-green-50 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Real-Time Analytics
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Monitor energy consumption, charging patterns, and cost
                  savings with intuitive dashboards and detailed visualizations.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Live usage tracking</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Cost breakdown analysis
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Environmental impact metrics
                    </span>
                  </li>
                </ul>
              </div>

              <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-600 hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-green-50 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  V2G Energy Trading
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Turn your EV into a revenue source by selling excess battery
                  power back to the grid during peak demand periods.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Location-specific pricing
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Automated trading</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Instant payment processing
                    </span>
                  </li>
                </ul>
              </div>

              <div className="group bg-white p-8 rounded-2xl border-2 border-gray-100 hover:border-green-600 hover:shadow-xl transition-all">
                <div className="bg-gradient-to-br from-green-50 to-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Battery className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Fleet Management
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Seamlessly manage multiple electric vehicles from a single,
                  unified dashboard with individual performance tracking.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Multi-vehicle monitoring
                    </span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">Comparative analytics</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">
                      Maintenance scheduling
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="benefits" className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 rounded-3xl p-12 md:p-16 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>

              <div className="relative">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4">Proven Results</h2>
                  <p className="text-green-100 text-lg">
                    Join thousands of EV owners maximizing their investment
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-10 w-10" />
                    </div>
                    <div className="text-5xl font-bold">$2,400</div>
                    <div className="text-green-100 text-lg">
                      Average Annual Savings
                    </div>
                    <p className="text-green-200 text-sm">
                      Through optimized charging and V2G trading
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Leaf className="h-10 w-10" />
                    </div>
                    <div className="text-5xl font-bold">48 Trees</div>
                    <div className="text-green-100 text-lg">
                      Equivalent CO₂ Saved
                    </div>
                    <p className="text-green-200 text-sm">
                      Environmental impact per vehicle annually
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white/10 backdrop-blur-sm w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Activity className="h-10 w-10" />
                    </div>
                    <div className="text-5xl font-bold">92%</div>
                    <div className="text-green-100 text-lg">
                      Lower Operating Costs
                    </div>
                    <p className="text-green-200 text-sm">
                      Compared to traditional vehicles
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose EVDash
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Industry-leading features that set us apart
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Shield className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Bank-Level Security
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Your data is protected with enterprise-grade encryption and
                  security protocols, ensuring complete privacy and safety.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Clock className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  24/7 Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our dedicated support team is available around the clock to
                  help you maximize your EV's potential and resolve any issues.
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <Activity className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Real-Time Updates
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Stay informed with instant notifications about energy prices,
                  charging status, and earnings opportunities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ready to Transform Your EV Experience?
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed">
              Join thousands of EV owners who are already saving money and
              contributing to a sustainable future.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="group px-10 py-5 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg rounded-xl hover:shadow-xl font-semibold transition-all hover:scale-105 inline-flex items-center space-x-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="mt-6 text-gray-500">
              No credit card required • 14-day free trial
            </p>
          </div>
        </section>
      </div>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">EVDash</span>
              </div>
              <p className="text-gray-400 text-sm">
                Empowering the electric future with intelligent energy
                management.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            © 2024 EVDash. All rights reserved. Powering the electric future.
          </div>
        </div>
      </footer>
    </div>
  );
}
