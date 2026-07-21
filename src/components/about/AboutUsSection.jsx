import React from 'react';
import AboutProject from './AboutProject';
import AboutDeveloper from './AboutDeveloper';
import PromotionalCard from '../ui/PromotionalCard';

const AboutUsSection = () => (
  <section id="about" className="min-h-screen w-full relative overflow-hidden scroll-mt-24">
    <div className="relative">
      <AboutProject />
      <AboutDeveloper />
      <PromotionalCard />
    </div>
  </section>
);

export default AboutUsSection;
