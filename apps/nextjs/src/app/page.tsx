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
      <div className="relative">
        <svg
          viewBox="0 0 1440 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          className="absolute top-0 bg-transparent"
        >
          <path
            d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
            fill="#171717"
          ></path>
        </svg>
      </div>
      <Features />
      <HowItWorks />
      <div className="relative">
        <svg
          viewBox="0 0 1440 58"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="100%"
          className="absolute bottom-0 bg-transparent"
        >
          <path
            transform="rotate(180) translate(-1440, -60)"
            d="M-100 58C-100 58 218.416 36.3297 693.5 36.3297C1168.58 36.3297 1487 58 1487 58V-3.8147e-06H-100V58Z"
            fill="#171717"
          ></path>
        </svg>
      </div>
      {/* <Integration /> */}
      {/* <UseCases /> */}
      {/* <Pricing /> */}
      {/* <Testimonials /> */}
      <Footer />
    </>
  );
}
