import { Navbar, Hero, QuickSearch, FacilityHighlights, Announcements, Footer } from '../components/LandingPage';

export const HomePage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <QuickSearch />
      <FacilityHighlights />
      <Announcements />
      <Footer />
    </>
  );
};
