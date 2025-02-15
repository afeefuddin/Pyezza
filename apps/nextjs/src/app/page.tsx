import Features from "@/components/landing/features";
import Footer from "@/components/landing/footer";
import Hero from "@/components/landing/hero";
// import Integration from "@/components/landing/integration";
import Navbar from "@/components/navbar";
// import Pricing from "@/components/landing/pricing";
// import Testimonials from "@/components/landing/testimonials";
// import UseCases from "@/components/landing/usecases";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      {/* <Integration /> */}
      {/* <UseCases /> */}
      {/* <Pricing /> */}
      {/* <Testimonials /> */}
      <Footer />
    </>
  );
}
