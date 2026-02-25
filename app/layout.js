import "./globals.css";
import localFont from "next/font/local";
import ClientLayout from "../components/ClientLayout";

const akira = localFont({
  src: "./fonts/akira.otf",
  variable: "--font-akira",
  display: "swap",
});

export const metadata = {
  title: "Raghav | Portfolio",
  description: "Personal portfolio of Raghav",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${akira.variable} font-sans antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
