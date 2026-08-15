import { useEffect } from "react";
import Lenis from "lenis";
import "@/App.css";
import { Toaster } from "sonner";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import About from "@/components/site/About";
import Services from "@/components/site/Services";
import WhyUs from "@/components/site/WhyUs";
import Portfolio from "@/components/site/Portfolio";
import Process from "@/components/site/Process";
import Testimonials from "@/components/site/Testimonials";
import Pricing from "@/components/site/Pricing";
import FAQ from "@/components/site/FAQ";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import LegalModal from "@/components/site/LegalModal";

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (t) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="App bg-background text-foreground">
      <div className="grain" aria-hidden="true" />
      <Toaster theme="dark" position="top-center" richColors />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <WhyUs />
        <Portfolio />
        <Process />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
      <LegalModal />
    </div>
  );
}

export default App;
