import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/hero';
import AgentsOverview from './components/agents-overview';
import HowItWorks from './components/how-it-works';
import ProofCarousel from './components/proof-carousel';
import Testimonials from './components/testimonials';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <main>
        <Hero />
        <AgentsOverview />
        <HowItWorks />
        <ProofCarousel />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}