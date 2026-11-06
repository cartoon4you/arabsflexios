'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Film, Tv, Bookmark, Compass, LogIn, LogOut, Download, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { MediaItem } from '@/lib/types';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, signInWithGoogle, logout } = useAuth();
  const { watchlist } = useWatchlist();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MediaItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    const q = val.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if ((window as any).__searchTimer) clearTimeout((window as any).__searchTimer);
    (window as any).__searchTimer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.results?.slice(0, 5) || []);
          setShowSuggestions(true);
        }
      } catch {
        setSuggestions([]);
      }
    }, 300);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { label: 'الرئيسية', href: '/', icon: Sparkles },
    { label: 'أفلام', href: '/catalog?category=arabic-movies', icon: Film },
    { label: 'مسلسلات', href: '/catalog?category=arabic-series', icon: Tv },
    { label: 'سينما عالمية', href: '/worldcinema', icon: Compass },
    { label: 'مستخرج الروابط', href: '/linkgrabber', icon: Download },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">
              يمن<span className="text-amber-500">فلکس</span>
            </span>
            <span className="text-[10px] text-zinc-400 -mt-1 font-medium">سينما وترفيه العرب</span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-zinc-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search bar & Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block w-48 lg:w-64">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="ابحث عن فيلم أو مسلسل..."
                className="w-full bg-zinc-900/90 text-sm text-white placeholder-zinc-500 rounded-lg pl-3 pr-9 py-1.5 border border-white/10 focus:outline-none focus:border-amber-500/60 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-amber-400"
                aria-label="بحث"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full mt-2 inset-x-0 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 space-y-1">
                  {suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/watch?id=${item.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 transition-colors text-right"
                    >
                      <img src={item.poster} alt={item.title} className="w-8 h-10 object-cover rounded" referrerPolicy="no-referrer" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        <div className="text-[10px] text-zinc-400">{item.year} • {item.categoryLabel}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Watchlist */}
          <Link
            href="/watchlist"
            className="relative p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
            title="قائمتي"
          >
            <Bookmark className="w-5 h-5" />
            {watchlist.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {watchlist.length}
              </span>
            )}
          </Link>

          {/* User Sign In */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 hidden lg:inline max-w-[100px] truncate">
                {currentUser.displayName || 'مستخدم'}
              </span>
              <button
                onClick={() => logout()}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 p-2 rounded-lg hover:bg-white/5"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signInWithGoogle()}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>دخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
