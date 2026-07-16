import { Cormorant_Garamond, Inter } from "next/font/google";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "./globals.css";

const headingFont = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} min-h-screen bg-white text-[#1E1E1E] antialiased`}
      >
        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
