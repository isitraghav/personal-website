import "./globals.css";
import localFont from "next/font/local";
import { Playfair_Display } from "next/font/google";
import ClientLayout from "../components/ClientLayout";

const akira = localFont({
  src: "./fonts/akira.otf",
  variable: "--font-akira",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const calendas = localFont({
  src: "./fonts/Calendas-Plus.ttf",
  variable: "--font-calendas",
  display: "swap",
});

export const metadata = {
  title: "Raghav",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${akira.variable} ${calendas.variable} ${playfair.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
