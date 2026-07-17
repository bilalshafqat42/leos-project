import { Inter, Libre_Baskerville } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Loader from "@/components/loader/Loader";
import "./globals.css";

const headingFont = Libre_Baskerville({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "LEOS Project Management",
    template: "%s | LEOS Project Management",
  },
  description:
    "Professional renovation, fit-out, construction and project management services across the UAE.",
  keywords: [
    "UAE construction company",
    "project management UAE",
    "renovation UAE",
    "fit-out UAE",
    "LEOS Project Management",
  ],
  openGraph: {
    title: "LEOS Project Management",
    description:
      "Renovation, fit-out, construction and project management delivered with precision across the UAE.",
    type: "website",
    locale: "en_AE",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-white text-[#1E1E1E] antialiased`}
      >
        <Loader />
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
