import { LeaseCalculator } from './LeaseCalculator';
import { Sparkles } from 'lucide-react';

export function LeasingPage() {
  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                             radial-gradient(2px 2px at 60% 70%, white, transparent),
                             radial-gradient(1px 1px at 50% 50%, white, transparent),
                             radial-gradient(1px 1px at 80% 10%, white, transparent),
                             radial-gradient(2px 2px at 90% 60%, white, transparent)`,
            backgroundSize: '200% 200%',
            animation: 'twinkle 10s ease-in-out infinite'
          }} />
        </div>

        <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
            <h1 className="text-6xl bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Leasing Options
            </h1>
            <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
          </div>
          <p className="text-2xl text-purple-200 max-w-3xl mx-auto">
            Calculate your lease payments and explore flexible options for your dream Toyota
          </p>
        </div>

        <style jsx>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>

      {/* Calculator Section */}
      <div className="bg-gradient-to-b from-indigo-950 via-purple-950 to-indigo-950 py-20 relative overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-5xl mb-4 text-white">
              Calculate Your Lease Payment
            </h2>
            <p className="text-xl text-purple-200">
              Get instant estimates for leasing your Toyota
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <LeaseCalculator />
          </div>

          {/* Additional Info */}
          <div className="mt-16 max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-purple-300/30">
            <h3 className="text-2xl text-white mb-6 text-center">Why Lease with Toyota Galaxy?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🌟</div>
                <div>
                  <h4 className="text-lg text-white mb-1">Lower Monthly Payments</h4>
                  <p className="text-purple-200">Typically lower than financing payments</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">💫</div>
                <div>
                  <h4 className="text-lg text-white mb-1">Always Drive New</h4>
                  <p className="text-purple-200">Get a new vehicle every few years</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">✨</div>
                <div>
                  <h4 className="text-lg text-white mb-1">Warranty Coverage</h4>
                  <p className="text-purple-200">Most repairs covered under warranty</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="text-2xl">⭐</div>
                <div>
                  <h4 className="text-lg text-white mb-1">Flexible Options</h4>
                  <p className="text-purple-200">Purchase option at lease end</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-950 via-purple-950 to-indigo-950 py-12 border-t border-purple-500/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-200 mb-4">
            © 2025 Toyota Galaxy. Your cosmic companion in auto financing.
          </p>
          <p className="text-purple-300 text-sm">
            Made with ✨ for Toyota enthusiasts across Texas
          </p>
        </div>
      </footer>
    </div>
  );
}
