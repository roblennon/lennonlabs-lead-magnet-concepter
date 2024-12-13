import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#1A1F2C]">
      <header className="border-b border-[#9b87f5]/20">
        <div className="container mx-auto px-8 py-12">
          <img 
            src="/lovable-uploads/03da23fe-9a53-4fbe-b9d9-1ee4f1589282.png" 
            alt="Lennon Labs Logo" 
            className="h-12 w-12 mb-6"
          />
          <h1 className="text-4xl font-bold text-white mb-4">
            AI-Powered Tools for Entrepreneurs
          </h1>
          <p className="text-xl text-[#C8C8C9] max-w-2xl">
            Discover our collection of specialized tools designed to help you grow your business faster.
          </p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link to="/revenue-finder" className="group">
            <Card className="p-6 bg-white/5 border-[#9b87f5]/20 hover:border-[#9b87f5]/40 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-[#9b87f5]/10 text-[#9b87f5]">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-white">Revenue Opportunity Finder</h2>
              </div>
              <p className="text-[#C8C8C9] leading-relaxed">
                Get personalized insights on your fastest path to increased revenue in just 3 minutes.
              </p>
            </Card>
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#9b87f5]/20 py-6">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#8E9196]">© 2024 Lennon Labs. All rights reserved.</span>
            <a 
              href="https://lennonlabs.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-[#9b87f5] hover:text-[#7E69AB] transition-colors"
            >
              lennonlabs.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;