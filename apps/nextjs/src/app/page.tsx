import HowItWorks from "@/components/landing/how-it-works";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
// import Integration from "@/components/landing/integration";
import Navbar from "@/components/navbar";
import Features from "@/components/landing/features";
// import Pricing from "@/components/landing/pricing";
// import Testimonials from "@/components/landing/testimonials";
// import UseCases from "@/components/landing/usecases";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      {/* <Integration /> */}
      {/* <UseCases /> */}
      {/* <Pricing /> */}
      {/* <Testimonials /> */}
      <Footer />
    </>
  );
}
