import ChatBox from "../components/ChatBox";
import { Car, Search, Bot } from "lucide-react";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.body.style.background =
      "linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3730a3 100%)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.padding = "0";

    // Cleanup on unmount
    return () => {
      document.body.style.background = "";
      document.body.style.minHeight = "";
      document.body.style.margin = "";
      document.body.style.padding = "";
    };
  }, []);

  return (
    <div
      className="min-h-screen p-4"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3730a3 100%)",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Car className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              AI<span className="text-blue-300">ccasion</span>
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Vind je perfecte tweedehands auto met de kracht van artificiële
            intelligentie
          </p>
        </div>

        {/* Chat Interface */}
        <ChatBox />

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Slim Zoeken
            </h3>
            <p className="text-blue-100 text-sm">
              Onze AI begrijpt je wensen en vindt de perfecte auto voor jou
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              24/7 Beschikbaar
            </h3>
            <p className="text-blue-100 text-sm">
              Onze AI adviseur is altijd beschikbaar om je te helpen
            </p>
          </div>

          <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Beste Deals
            </h3>
            <p className="text-blue-100 text-sm">
              Vind de beste occasions tegen de scherpste prijzen
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
