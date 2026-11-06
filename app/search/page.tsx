'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, Loader2, Film } from 'lucide-react';
import { MediaItem } from '@/lib/types';
import { MovieCard } from '@/components/MovieCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [, startTransition] = useTransition();

  const performSearch = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      }
    } catch (err) {
      console.warn('Search fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q') || '';
    queueMicrotask(() => {
      setQuery(q);
      if (q) {
        performSearch(q);
      } else {
        setResults([]);
      }
    });
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      });
      performSearch(query.trim());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl font-black text-white">بحث يمن فلکس الشامل</h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          ابحث في آلاف الأفلام والمسلسلات العربية والأجنبية والتركية والأنمي
        </p>

        <form onSubmit={handleSubmit} className="relative mt-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="اكتب اسم الفيلم، المسلسل، أو الممثل..."
            className="w-full bg-zinc-900 text-white placeholder-zinc-500 rounded-2xl pl-12 pr-12 py-3.5 border border-white/10 focus:outline-none focus:border-amber-500 shadow-xl transition-all text-sm sm:text-base"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
          <button
            type="submit"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-md"
          >
            بحث
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          <p className="text-xs text-zinc-400">جارٍ البحث في المصادر الحية وسيرفرات البث...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>نتائج البحث لـ &quot;{query}&quot;</span>
            <span>{results.length} عمل متوفر</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((item) => (
              <MovieCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : query.trim() ? (
        <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/5 space-y-3">
          <Film className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">لم نجد نتائج مطابقة لـ &quot;{query}&quot;</h3>
          <p className="text-xs text-zinc-400">تأكد من كتابة الاسم بدقة، أو ابحث باسم عام مثل &quot;عثمان&quot; أو &quot;باتمان&quot;.</p>
        </div>
      ) : null}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-zinc-400">جارٍ التحميل...</div>}>
      <SearchContent />
    </Suspense>
  );
}
