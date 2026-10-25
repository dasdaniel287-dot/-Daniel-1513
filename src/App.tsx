/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Globe,
  Rocket,
  Compass,
  Telescope,
  Newspaper,
  Calculator,
  GraduationCap,
  Image as ImageIcon,
  ArrowRight,
  Flame,
  Calendar,
  Zap,
  Info,
  ChevronRight,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

import { CosmicNavbar, NavigationPage } from './components/CosmicNavbar.tsx';
import { CosmicStarfield } from './components/CosmicStarfield.tsx';
import { SolarSystemViewer } from './components/SolarSystemViewer.tsx';
import { GalaxyExplorer } from './components/GalaxyExplorer.tsx';
import { BlackHoleSimulation } from './components/BlackHoleSimulation.tsx';
import { ExoplanetExplorer } from './components/ExoplanetExplorer.tsx';
import { SpaceMissionsTracker } from './components/SpaceMissionsTracker.tsx';
import { GalaxyAIChat } from './components/GalaxyAIChat.tsx';
import { LearningCenter } from './components/LearningCenter.tsx';
import { CosmicCalculators } from './components/CosmicCalculators.tsx';
import { SpaceGalleryView } from './components/SpaceGalleryView.tsx';
import { SpaceNewsSection } from './components/SpaceNewsSection.tsx';
import { UserProfileModal } from './components/UserProfileModal.tsx';
import { AboutModal } from './components/AboutModal.tsx';
import { galaxiesData, celestialBodiesData, spaceMissionsData } from './data/spaceData.ts';

const BOOKMARKS_STORAGE_KEY = 'galaxy_science_ai_bookmarks_v1';
const LANG_STORAGE_KEY = 'galaxy_science_ai_lang_v1';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [language, setLanguage] = useState<'en' | 'bn'>(() => {
    try {
      return (localStorage.getItem(LANG_STORAGE_KEY) as 'en' | 'bn') || 'en';
    } catch {
      return 'en';
    }
  });

  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : ['Andromeda Galaxy', 'TRAPPIST-1e', 'James Webb Space Telescope'];
    } catch {
      return ['Andromeda Galaxy', 'TRAPPIST-1e'];
    }
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [aboutDefaultTab, setAboutDefaultTab] = useState<'about' | 'contact' | 'privacy' | 'terms'>('about');

  // Daily Space Fact (Calculated for current date)
  const dailyFact = {
    title: 'Neutron Star Density Extreme',
    fact: 'A single sugar-cube-sized volume of neutron star material has a mass of approximately 1 billion metric tons on Earth — equal to the weight of Mount Everest compressed into a thimble.',
    factBn: 'একটি নিউট্রন তারার মাত্র এক চামচ পদার্থের ভর পৃথিবীতে প্রায় ১০০ কোটি টন বা গোটা এভারেস্ট পর্বতের ভরের সমান।',
  };

  // Upcoming 2026 Astronomical Events
  const upcomingEvents = [
    {
      date: 'Aug 12-13, 2026',
      name: 'Perseids Meteor Shower Peak',
      desc: 'Swift-Tuttle debris cloud producing up to 100 fast, luminous meteors per hour in dark skies.',
    },
    {
      date: 'August 12, 2026',
      name: 'Total Solar Eclipse (Europe & Arctic)',
      desc: 'Totality path crosses Greenland, Iceland, and Northern Spain.',
    },
    {
      date: 'Late 2026',
      name: 'Artemis II Lunar Crewed Flyby',
      desc: 'Four astronauts aboard the Orion spacecraft venture around the far side of the Moon.',
    },
  ];

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Bookmarks save error', e);
    }
  }, [bookmarks]);

  // Save Language
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch (e) {
      console.warn('Language save error', e);
    }
  }, [language]);

  const handleToggleBookmark = (item: string) => {
    if (bookmarks.includes(item)) {
      setBookmarks((prev) => prev.filter((b) => b !== item));
    } else {
      setBookmarks((prev) => [...prev, item]);
    }
  };

  const handleClearAllData = () => {
    setBookmarks([]);
    localStorage.removeItem(BOOKMARKS_STORAGE_KEY);
  };

  const openInfoModal = (tab: 'about' | 'contact' | 'privacy' | 'terms') => {
    setAboutDefaultTab(tab);
    setIsAboutOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      {/* 2D / 3D Canvas Starfield Backdrop */}
      <CosmicStarfield />

      {/* Main Top Navigation */}
      <CosmicNavbar
        currentPage={currentPage}
        onNavigate={(page) => {
          if (page === 'profile') setIsProfileOpen(true);
          else if (page === 'about') openInfoModal('about');
          else {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        bookmarkCount={bookmarks.length}
      />

      {/* Main Page Render */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 sm:py-10 z-10">
        {/* 1. HOMEPAGE */}
        {currentPage === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* HERO SECTION */}
            <section className="relative text-center py-10 sm:py-16 space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold backdrop-blur-md shadow-sm shadow-cyan-500/10">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Next-Generation Space Science Platform • 2026 Edition</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
                Explore the Universe{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                  Beyond Imagination
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-zinc-300 max-w-2xl mx-auto leading-relaxed">
                Discover galaxies, explore distant worlds, and unlock the mysteries of the cosmos with
                AI-powered science.
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentPage('solar-system')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-zinc-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Globe className="w-4 h-4 text-zinc-950" />
                  <span>Explore the Universe</span>
                  <ArrowRight className="w-4 h-4 text-zinc-950" />
                </button>

                <button
                  onClick={() => setCurrentPage('ai-chat')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Ask Galaxy AI</span>
                </button>

                <button
                  onClick={() => setCurrentPage('missions')}
                  className="px-5 py-3 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 font-semibold text-xs sm:text-sm border border-zinc-700 transition-all flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4 text-amber-400" />
                  <span>Discover Space Missions</span>
                </button>
              </div>
            </section>

            {/* DAILY SPACE FACT CALLOUT */}
            <section className="rounded-2xl bg-gradient-to-r from-purple-950/40 via-zinc-900/60 to-cyan-950/40 border border-purple-500/30 p-5 sm:p-6 backdrop-blur-md shadow-xl flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-400 shrink-0">
                <Flame className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    Daily Cosmic Observation
                  </span>
                  <span className="text-[10px] text-zinc-400">• Verified Astrophysics Fact</span>
                </div>
                <h3 className="text-base font-bold text-white">{dailyFact.title}</h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {language === 'bn' ? dailyFact.factBn : dailyFact.fact}
                </p>
              </div>
            </section>

            {/* INTERACTIVE SOLAR SYSTEM PREVIEW */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span>Interactive Solar System Preview</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Explore planetary orbits, composition, and physical metrics.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentPage('solar-system')}
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <span>Launch Full 3D Simulator</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <SolarSystemViewer />
            </section>

            {/* FEATURED DISCOVERIES & MODULE SHORTCUTS */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Featured Scientific Modules</span>
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setCurrentPage('galaxies')}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit mb-3">
                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-white group-hover:text-purple-300 transition-colors">
                    Galaxy Explorer
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Explore spiral density waves, elliptical formations, and collision remnants like the Cartwheel.
                  </p>
                  <span className="mt-3 text-xs text-purple-400 font-semibold inline-flex items-center gap-1">
                    Explore Galaxies <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div
                  onClick={() => setCurrentPage('black-holes')}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-rose-500/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 w-fit mb-3">
                    <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-white group-hover:text-rose-300 transition-colors">
                    Black Hole Relativity
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Interactive event horizons, Kerr spin parameters, Doppler beaming, and Hawking radiation.
                  </p>
                  <span className="mt-3 text-xs text-rose-400 font-semibold inline-flex items-center gap-1">
                    Launch Physics Simulation <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div
                  onClick={() => setCurrentPage('exoplanets')}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit mb-3">
                    <Telescope className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-white group-hover:text-emerald-300 transition-colors">
                    Exoplanet Catalog
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Discover habitable-zone candidates, Earth twins, and extreme hot Jupiters.
                  </p>
                  <span className="mt-3 text-xs text-emerald-400 font-semibold inline-flex items-center gap-1">
                    Browse Catalog <ChevronRight className="w-3 h-3" />
                  </span>
                </div>

                <div
                  onClick={() => setCurrentPage('calculators')}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-amber-500/50 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 group"
                >
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit mb-3">
                    <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors">
                    Cosmic Calculators
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Compute Kepler orbits, planetary weights, light-year distances, and Schwarzschild radii.
                  </p>
                  <span className="mt-3 text-xs text-amber-400 font-semibold inline-flex items-center gap-1">
                    Solve Astrophysics <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </section>

            {/* UPCOMING ASTRONOMICAL EVENTS */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-teal-400" />
                    <span>Upcoming Celestial Events (2026)</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Verified calendar of meteor showers, eclipses, and lunar expeditions.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {upcomingEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 hover:border-teal-500/40 transition-colors"
                  >
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300 font-semibold">
                      {evt.date}
                    </span>
                    <h4 className="font-bold text-sm text-white">{evt.name}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">{evt.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 2. SOLAR SYSTEM 3D */}
        {currentPage === 'solar-system' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SolarSystemViewer />
          </div>
        )}

        {/* 3. GALAXY EXPLORER */}
        {currentPage === 'galaxies' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <GalaxyExplorer />
          </div>
        )}

        {/* 4. BLACK HOLE EXPLORER */}
        {currentPage === 'black-holes' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <BlackHoleSimulation />
          </div>
        )}

        {/* 5. EXOPLANET EXPLORER */}
        {currentPage === 'exoplanets' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <ExoplanetExplorer />
          </div>
        )}

        {/* 6. SPACE MISSIONS */}
        {currentPage === 'missions' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SpaceMissionsTracker />
          </div>
        )}

        {/* 7. GALAXY AI CHAT */}
        {currentPage === 'ai-chat' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <GalaxyAIChat />
          </div>
        )}

        {/* 8. SCIENCE LEARNING CENTER */}
        {currentPage === 'learning' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <LearningCenter />
          </div>
        )}

        {/* 9. COSMIC CALCULATORS */}
        {currentPage === 'calculators' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <CosmicCalculators />
          </div>
        )}

        {/* 10. SPACE NEWS */}
        {currentPage === 'news' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SpaceNewsSection />
          </div>
        )}

        {/* 11. SPACE GALLERY & APOD */}
        {currentPage === 'gallery' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <SpaceGalleryView />
          </div>
        )}
      </main>

      {/* User Profile & Bookmarks Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        language={language}
        setLanguage={setLanguage}
        bookmarks={bookmarks}
        onRemoveBookmark={(bm) => setBookmarks((prev) => prev.filter((b) => b !== bm))}
        onClearAllData={handleClearAllData}
      />

      {/* About & Contact Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        defaultTab={aboutDefaultTab}
      />

      {/* FOOTER */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/90 py-8 px-4 z-10 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Galaxy Science AI</span>
              <p className="text-[11px] text-zinc-500">
                Exploring the universe with scientific integrity & AI intelligence
              </p>
            </div>
          </div>

          {/* Quick Informational Links */}
          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <button onClick={() => openInfoModal('about')} className="hover:text-white transition-colors">
              About
            </button>
            <button onClick={() => openInfoModal('contact')} className="hover:text-white transition-colors">
              Contact
            </button>
            <button onClick={() => openInfoModal('privacy')} className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => openInfoModal('terms')} className="hover:text-white transition-colors">
              Terms of Use
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 font-mono">
            Astronomical data via NASA, ESA & STScI • 2026
          </div>
        </div>
      </footer>
    </div>
  );
}
