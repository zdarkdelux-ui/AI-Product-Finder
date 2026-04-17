/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SearchAssistant } from "./components/SearchAssistant";
import { LayoutGrid, ShoppingBag, User, Ghost } from "lucide-react";
import { GeometricBackground } from "./components/GeometricBackground";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative">
      <GeometricBackground />
      
      {/* Geometric App Container */}
      <div className="w-full max-w-[1200px] min-h-[800px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] border border-border flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-[80px] border-b border-border flex items-center px-8 justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="font-extrabold text-[20px] tracking-tight text-accent flex items-center">
              AI <span className="text-text-main ml-1">Product Finder</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-bold text-[14px]">
            <a href="#" className="text-accent">Подборщик</a>
            <a href="#" className="text-text-main hover:text-accent transition-colors">Каталог</a>
            <a href="#" className="text-text-main hover:text-accent transition-colors">Проекты</a>
          </div>

          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-text-muted">
            M
          </div>
        </header>

        {/* Main Dashboard Layout is inside SearchAssistant */}
        <SearchAssistant />
      </div>
    </div>
  );
}

