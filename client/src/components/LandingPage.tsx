import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  AlertTriangle,
  Heart,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Stethoscope,
  Database
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Smart Drug Search",
      description: "Advanced search with autocomplete for thousands of medications by generic or brand names."
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Interaction Detection",
      description: "Real-time analysis of drug combinations with severity classification and clinical warnings."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Condition-Based Alerts",
      description: "Personalized warnings based on medical conditions like diabetes, hypertension, and more."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Comprehensive Database",
      description: "Extensive medication database with detailed drug information and manufacturer details."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safety First",
      description: "Critical interaction warnings with blocking alerts for contraindicated combinations."
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Educational Resources",
      description: "Detailed explanations of drug classes, mechanisms, and clinical recommendations."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Medications Tracked" },
    { number: "500+", label: "Drug Interactions" },
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "24/7", label: "Available Access" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MediCheck
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="#safety" className="text-gray-600 hover:text-blue-600 transition-colors">Safety</a>
              <button
                onClick={() => navigate('/drug-info')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Safe Medication
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Interaction Checker
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Professional-grade drug interaction analysis to help healthcare providers and patients
              make informed medication decisions with confidence.
            </p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
              <p className="text-yellow-800 text-sm font-medium">
                <span className="font-bold">Educational Purpose:</span> This tool is designed for educational and informational purposes only.
                Always consult with healthcare professionals for medical advice.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate('/interaction-checker')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
              >
                Check Drug Interactions
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/drug-info')}
                className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 border border-gray-200 flex items-center gap-2"
              >
                Browse Medications
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="block text-blue-600">Medication Safety</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides healthcare professionals and patients with the tools
              they need to identify potential drug interactions and make safer medication decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group hover:border-blue-200">
                <div className="text-blue-600 mb-4 group-hover:text-purple-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and reliable drug interaction checking in just a few steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Medications</h3>
              <p className="text-gray-600">
                Search and select the medications you want to check using our smart autocomplete system.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Conditions</h3>
              <p className="text-gray-600">
                Optionally include medical conditions to get more personalized interaction warnings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Results</h3>
              <p className="text-gray-600">
                Receive instant, detailed analysis with severity levels and clinical recommendations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section id="safety" className="py-20 bg-gradient-to-r from-red-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Important Safety Notice</h2>
            <div className="text-left space-y-4 text-gray-700">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p>This tool is designed for <strong>educational purposes only</strong> and should not replace professional medical advice.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p>Always consult with qualified healthcare professionals before making any medication decisions.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p>Drug interactions can be complex and may vary based on individual patient factors.</p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <p>This information should supplement, not substitute, the expertise and judgment of healthcare providers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Check Your Medications?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Start using our comprehensive drug interaction checker to make more informed medication decisions today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/interaction-checker')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Check Interactions Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/conditions')}
              className="bg-transparent text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 border border-white/20 flex items-center justify-center gap-2"
            >
              Browse Conditions
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">MediCheck</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional drug interaction checker for educational purposes.
                Always consult healthcare professionals for medical advice.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Drug Search</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interaction Checker</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Condition Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Safety Alerts</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Drug Database</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Medical Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Clinical Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Educational Materials</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Disclaimer</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 MediCheck. All rights reserved. For educational purposes only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;