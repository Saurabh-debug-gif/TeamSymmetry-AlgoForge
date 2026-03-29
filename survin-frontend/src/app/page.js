import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/Stats";
import Process from "@/components/Process";
import DoctorsShowcase from "@/components/DoctorsShowcase";
import MedicinesShowcase from "@/components/MedicinesShowcase";
import Testimonials from "@/components/Testimonials";
import MedicalsSection from "@/components/MedicalsSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <div className="line-divider" />
            <Features />
            <div className="line-divider" />
            <Stats />
            <div className="line-divider" />

            {/* ✅ ID add karo — navbar scroll ke liye */}
            <div id="doctors">
                <DoctorsShowcase />
            </div>
            <div className="line-divider" />

            <Process />
            <div className="line-divider" />

            <div id="medicines">
                <MedicinesShowcase />
            </div>
            <div className="line-divider" />

            <Testimonials />
            <div className="line-divider" />

            <div id="medicals">
                <MedicalsSection />
            </div>
            <div className="line-divider" />

            <div id="contact">
                <Contact />
            </div>
            <Footer />
        </main>
    );
}