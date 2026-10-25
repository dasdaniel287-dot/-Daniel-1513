import React, { useState } from 'react';
import {
  Sparkles,
  Globe,
  Compass,
  Telescope,
  Rocket,
  Newspaper,
  Image as ImageIcon,
  MessageSquare,
  GraduationCap,
  Calculator,
  Bookmark,
  User,
  Menu,
  X,
  ChevronDown,
  Zap,
} from 'lucide-react';

export type NavigationPage =
  | 'home'
  | 'solar-system'
  | 'galaxies'
  | 'black-holes'
  | 'exoplanets'
  | 'missions'
  | 'ai-chat'
  | 'learning'
  | 'calculators'
  | 'news'
  | 'gallery'
  | 'profile'
  | 'about';

interface CosmicNavbarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  bookmarkCount: number;
}

export const CosmicNavbar: React.FC<CosmicNavbarProps> = ({
  currentPage,
  onNavigate,
  bookmarkCount,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [exploreDropdownOpen, setExploreDropdownOpen] = useState(false);

  const handleNav = (page: NavigationPage) => {
    onNavigate(page);
    setIsMobileMenuOpen(false);
    setExploreDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => handleNav('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                Galaxy Science AI
              </span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono hidden sm:inline">
                2026
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 hidden sm:block">
              Astrophysics & Space Science Platform
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            Home
          </button>

          {/* Explore Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExploreDropdownOpen(!exploreDropdownOpen)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                ['solar-system', 'galaxies', 'black-holes', 'exoplanets', 'missions'].includes(
                  currentPage
                )
                  ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span>Explore Cosmos</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {exploreDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl p-2 space-y-1 backdrop-blur-xl animate-in fade-in"
                onMouseLeave={() => setExploreDropdownOpen(false)}
              >
                <button
                  onClick={() => handleNav('solar-system')}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-xs">Solar System 3D</p>
                    <p className="text-[10px] text-zinc-500">Planets, orbits, and moons</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('galaxies')}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="font-semibold text-xs">Galaxy Explorer</p>
                    <p className="text-[10px] text-zinc-500">Spiral, elliptical, & rings</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('black-holes')}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <Zap className="w-4 h-4 text-rose-400" />
                  <div>
                    <p className="font-semibold text-xs">Black Hole Explorer</p>
                    <p className="text-[10px] text-zinc-500">Event horizons & relativity</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('exoplanets')}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <Telescope className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-xs">Exoplanets</p>
                    <p className="text-[10px] text-zinc-500">Habitable zones & worlds</p>
                  </div>
                </button>
                <button
                  onClick={() => handleNav('missions')}
                  className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
                >
                  <Rocket className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-semibold text-xs">Space Missions</p>
                    <p className="text-[10px] text-zinc-500">JWST, Artemis, & Europa</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNav('ai-chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'ai-chat'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm shadow-purple-500/10'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Galaxy AI</span>
          </button>

          <button
            onClick={() => handleNav('learning')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'learning'
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Learning Center</span>
          </button>

          <button
            onClick={() => handleNav('calculators')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'calculators'
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Calculators</span>
          </button>

          <button
            onClick={() => handleNav('news')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'news'
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5 text-teal-400" />
            <span>News</span>
          </button>

          <button
            onClick={() => handleNav('gallery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
              currentPage === 'gallery'
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Gallery & APOD</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Ask Galaxy AI Quick Pill */}
          <button
            onClick={() => handleNav('ai-chat')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-zinc-950 font-bold text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-zinc-950" />
            <span>Ask Galaxy AI</span>
          </button>

          {/* Profile / Preferences */}
          <button
            onClick={() => handleNav('profile')}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-all"
            title="User Profile & Settings"
          >
            <User className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-xl p-4 space-y-2 animate-in fade-in">
          <button
            onClick={() => handleNav('home')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900"
          >
            Home
          </button>
          <button
            onClick={() => handleNav('solar-system')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>Solar System 3D</span>
          </button>
          <button
            onClick={() => handleNav('galaxies')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Galaxy Explorer</span>
          </button>
          <button
            onClick={() => handleNav('black-holes')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-rose-400" />
            <span>Black Hole Explorer</span>
          </button>
          <button
            onClick={() => handleNav('exoplanets')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Telescope className="w-4 h-4 text-emerald-400" />
            <span>Exoplanet Catalog</span>
          </button>
          <button
            onClick={() => handleNav('missions')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Rocket className="w-4 h-4 text-amber-400" />
            <span>Space Missions</span>
          </button>
          <button
            onClick={() => handleNav('ai-chat')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-purple-300 hover:bg-zinc-900 flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>Galaxy AI Chat</span>
          </button>
          <button
            onClick={() => handleNav('learning')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>Learning Center & Quizzes</span>
          </button>
          <button
            onClick={() => handleNav('calculators')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>Cosmic Calculators</span>
          </button>
          <button
            onClick={() => handleNav('news')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <Newspaper className="w-4 h-4 text-teal-400" />
            <span>Astronomy News</span>
          </button>
          <button
            onClick={() => handleNav('gallery')}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-zinc-200 hover:bg-zinc-900 flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4 text-indigo-400" />
            <span>Gallery & APOD</span>
          </button>
        </div>
      )}
    </header>
  );
};
