"use client"

import React from 'react';
import { 
  Monitor, 
  Shield, 
  Bell, 
  BarChart3, 
  Globe, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Activity,
  Smartphone
} from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center bg-gray-900/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
              <Zap className="h-4 w-4 text-emerald-400 mr-2" />
              <span className="text-sm text-gray-300">99.9% uptime guarantee</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              Never Miss<br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Downtime Again
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Monitor your websites, APIs, and services 24/7. Get instant alerts when something goes wrong 
              and detailed insights to keep your business running smoothly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 flex items-center group cursor-pointer">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => router.push('/dashboard')} className="border border-gray-600 hover:border-gray-500 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-gray-900/50 hover:scale-105 cursor-pointer">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">30s</div>
              <div className="text-gray-400">Check Interval</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">10K+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"> Stay Online</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive monitoring tools that give you complete visibility into your infrastructure
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-emerald-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
              <div className="bg-emerald-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Website Monitoring</h3>
              <p className="text-gray-400">Monitor your websites from multiple global locations with customizable check intervals.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-blue-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
              <div className="bg-blue-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">API Monitoring</h3>
              <p className="text-gray-400">Test your APIs with custom headers, authentication, and response validation.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
              <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Bell className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Alerts</h3>
              <p className="text-gray-400">Get notified instantly via email, SMS, Slack, or webhook when issues arise.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-orange-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
              <div className="bg-orange-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Analytics</h3>
              <p className="text-gray-400">Comprehensive reports with uptime statistics, response times, and performance trends.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-red-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
              <div className="bg-red-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">SSL Monitoring</h3>
              <p className="text-gray-400">Track SSL certificate expiration dates and get alerts before they expire.</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-yellow-400/50 transition-all duration-300 hover:transform hover:scale-105 cursor-pointer">
              <div className="bg-yellow-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                <Smartphone className="h-6 w-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mobile App</h3>
              <p className="text-gray-400">Monitor your services on the go with our native mobile applications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-emerald-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Add Your Services</h3>
              <p className="text-gray-400">Simply enter your website URLs, API endpoints, or service details to start monitoring.</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Configure Alerts</h3>
              <p className="text-gray-400">Set up notification channels and customize alert conditions to match your needs.</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Stay Informed</h3>
              <p className="text-gray-400">Receive instant notifications and access detailed reports whenever you need them.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple, Transparent 
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent"> Pricing</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Choose the plan that fits your monitoring needs. All plans include our core features.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:scale-105 transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Starter</h3>
                <div className="text-4xl font-bold mb-2">$9<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">Perfect for small websites</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Up to 5 monitors</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>1-minute check intervals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Email alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Basic reporting</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 hover:border-emerald-400 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Start Free Trial
              </button>
            </div>

            {/* Professional Plan */}
            <div className="bg-gray-900/50 border-2 border-emerald-400 rounded-xl p-8 relative duration-300 transition-all hover:scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-emerald-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Professional</h3>
                <div className="text-4xl font-bold mb-2">$29<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">For growing businesses</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Up to 50 monitors</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>30-second check intervals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Multi-channel alerts</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Advanced reporting</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>API access</span>
                </li>
              </ul>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg font-semibold transition-colors cursor-pointer">
                Start Free Trial
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 transform-all duration-300 hover:scale-105">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-4xl font-bold mb-2">$99<span className="text-lg text-gray-400">/month</span></div>
                <p className="text-gray-400">For large organizations</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Unlimited monitors</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>10-second check intervals</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 mr-3" />
                  <span>White-label option</span>
                </li>
              </ul>
              <button className="w-full border border-gray-600 hover:border-blue-400 py-3 rounded-lg font-semibold transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-600/20 to-blue-600/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Never Miss Downtime Again?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of businesses that trust UpGuard to keep their services running smoothly.
          </p>
          <button className="bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:scale-105 cursor-pointer">
            Start Your Free 14-Day Trial
          </button>
          <p className="text-sm text-gray-400 mt-4">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Monitor className="h-8 w-8 text-emerald-400" />
                <span className="text-xl font-bold">UpGuard</span>
              </div>
              <p className="text-gray-400">
                Reliable uptime monitoring for modern businesses. Stay online, stay profitable.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Website Monitoring</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Monitoring</a></li>
                <li><a href="#" className="hover:text-white transition-colors">SSL Monitoring</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status Pages</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 UpGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;