import Header from "@/components/header";
import "./globals.scss";
import { Inter } from "next/font/google";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mars Rover in JavaScript",
  description:
    "An app of robotic rovers landed by NASA on different plateaus of Mars.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
