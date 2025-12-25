import React, { useState, useEffect } from 'react';
import { analyzeTrends } from './services/geminiService';
import TrendCard from './components/TrendCard';
import PythonCodeModal from './components/PythonCodeModal';
import { AnalysisResult, TrendingItem } from './types';

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPython, setShowPython] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeTrends();
      setData(result);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to fetch trends. Please try again later or check your API key.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900 font-sans">
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                T
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">ThaiTrend</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowPython(true)}
                className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-md hover:bg-slate-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                View Python Script
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Section */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-bold tracking-wide uppercase mb-4">
            AI-Powered Analysis
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            Discover What's Trending in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Thailand</span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Real-time analysis of headlines from <span className="font-semibold text-slate-800">Thairath</span>, <span className="font-semibold text-slate-800">Sanook</span>, and <span className="font-semibold text-slate-800">Matichon</span> to bring you the top 3 most talked-about topics right now.
          </p>
          
          <div className="flex justify-center gap-4">
            <button 
              onClick={fetchTrends}
              disabled={loading}
              className={`
                px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-indigo-200 
                flex items-center gap-3 transition-all duration-200 transform hover:-translate-y-1
                ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'}
              `}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Scanning Sources...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Trends
                </>
              )}
            </button>
            <button 
              onClick={() => setShowPython(true)}
              className="md:hidden px-6 py-4 rounded-xl font-semibold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
            >
              Code
            </button>
          </div>
          {lastUpdated && !loading && (
             <p className="mt-4 text-xs text-slate-400">
               Last updated: {lastUpdated.toLocaleTimeString()}
             </p>
          )}
        </div>

        {/* Results Section */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-center max-w-2xl mx-auto mb-12">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {data && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {data.trends.map((item, index) => (
              <TrendCard key={index} item={item} delay={index * 150} />
            ))}
          </div>
        )}

        {/* Loading State Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow border border-slate-100 p-6 h-64 flex flex-col animate-pulse">
                <div className="flex justify-between mb-6">
                  <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                  <div className="h-4 w-16 bg-slate-200 rounded"></div>
                </div>
                <div className="h-8 bg-slate-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3 flex-1">
                   <div className="h-4 bg-slate-200 rounded w-full"></div>
                   <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                   <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sources Footer */}
        <div className="border-t border-slate-200 pt-8 text-center">
           <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Sources Monitored</h4>
           <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-serif text-2xl font-bold text-slate-800">Thairath</span>
              <span className="font-sans text-2xl font-extrabold text-[#d2000d]">Sanook!</span>
              <span className="font-serif text-2xl font-bold text-slate-700">Matichon</span>
           </div>
        </div>

      </main>

      <PythonCodeModal isVisible={showPython} onClose={() => setShowPython(false)} />
    </div>
  );
};

export default App;