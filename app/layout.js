import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import GeminiChatWidget from "@/components/shared/GeminiChatWidget"; 

export const metadata = {
  title: "Anicodes - Your Coding Ground",
  description: "Best Coding platform for all your needs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />

        {/* ✅ Placeholder for Gemini Chat Widget */}
        {/* This component will handle the UI and communication with your Gemini API backend */}
        <GeminiChatWidget />
      </body>
    </html>
  );
}

