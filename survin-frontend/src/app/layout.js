import "./globals.css";

import { Providers } from "./providers";

export const metadata = {
    title: "Survin Healthcare — Premium . Professional . Compassionate",
    description:
        "India's most trusted healthcare platform. Connect with verified doctors, book appointments, get digital prescriptions.",
    keywords:
        "healthcare, doctors, appointments, prescriptions, medical, India",
    openGraph: {
        title: "Survin Healthcare",
        description: "Premium Healthcare Platform",
        type: "website",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>
        {/* ORB GLOWS — Har page pe dikhenge */}
        <div className="orb orb1" />
        <div className="orb orb2" />

        {/* MAIN CONTENT */}
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}