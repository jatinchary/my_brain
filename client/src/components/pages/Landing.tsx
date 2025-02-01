import type React from "react"
import { Link } from "react-router-dom"
import { ArrowRight, BrainIcon, Shield, Zap } from "lucide-react"

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <BrainIcon className="h-8 w-8 text-[#004dff]" />
            <span className="ml-2 text-xl font-bold text-gray-800">Brain.ly</span>
          </div>
          <div>
            <Link
              to="/signup"
              className="bg-[#004dff] hover:bg-[#336dff] text-white font-bold py-2 px-4 rounded-full transition duration-300"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Organize Your Thoughts with Brain.ly</h1>
          <p className="text-xl text-gray-600 mb-8">
            Store, categorize, and access your important links and ideas in one secure place.
          </p>
          <Link
            to="/signup"
            className="bg-[#004dff] hover:bg-[#336dff] text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 inline-flex items-center"
          >
            Start Saving Links <ArrowRight className="ml-2" />
          </Link>
        </section>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Brain.ly?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Zap className="h-12 w-12 text-[#004dff]" />}
                title="Lightning Fast"
                description="Access your links and notes instantly with our optimized storage system."
              />
              <FeatureCard
                icon={<Shield className="h-12 w-12 text-[#336dff]" />}
                title="Secure Storage"
                description="Your data is encrypted and protected with industry-standard security."
              />
              <FeatureCard
                icon={<BrainIcon className="h-12 w-12 text-[#40afff]" />}
                title="Smart Organization"
                description="Categorize, tag, and connect your links and ideas effortlessly."
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <StepCard number={1} title="Sign Up" description="Create your free account in seconds." />
              <StepCard number={2} title="Add Links" description="Easily input or import your important links." />
              <StepCard number={3} title="Access Anywhere" description="Retrieve your links on any device, anytime." />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#004dff] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Supercharge Your Digital Brain?</h2>
            <p className="text-xl text-white mb-8">
              Join thousands of users who have already enhanced their productivity with Brain.ly.
            </p>
            <Link
              to="/signup"
              className="bg-white text-[#004dff] hover:bg-gray-100 font-bold py-3 px-8 rounded-full text-lg transition duration-300"
            >
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <BrainIcon className="h-6 w-6 text-[#004dff]" />
            <span className="ml-2 text-lg font-bold">Brain.ly</span>
          </div>
          <div className="text-sm">© 2023 Brain.ly. All rights reserved.</div>
        </div>
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center transition duration-300 hover:shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

interface StepCardProps {
  number: number
  title: string
  description: string
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  return (
    <div className="bg-white rounded-lg p-6 text-center shadow-md">
      <div className="bg-[#004dff] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

export default LandingPage

