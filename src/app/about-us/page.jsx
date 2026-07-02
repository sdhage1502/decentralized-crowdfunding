import AboutProject from './aboutProject';
import AboutDeveloper from './aboutDeveloper';
import PromotionalCard from '../components/promotionalCard';

const AboutUsPage = () => (
  <section id="about" className="min-h-screen w-full relative overflow-hidden scroll-mt-24">
    <div className="relative">
      <AboutProject />
      <AboutDeveloper />
      <PromotionalCard />
    </div>
  </section>
);

export default AboutUsPage;
