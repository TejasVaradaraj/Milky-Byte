import { Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                           radial-gradient(2px 2px at 60% 70%, white, transparent),
                           radial-gradient(1px 1px at 50% 50%, white, transparent),
                           radial-gradient(1px 1px at 80% 10%, white, transparent),
                           radial-gradient(2px 2px at 90% 60%, white, transparent),
                           radial-gradient(1px 1px at 33% 80%, white, transparent),
                           radial-gradient(1px 1px at 15% 95%, white, transparent)`,
          backgroundSize: '200% 200%',
          backgroundPosition: '50% 50%',
          animation: 'twinkle 10s ease-in-out infinite'
        }} />
      </div>

      {/* Glowing planets/orbs */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-purple-500 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-32 left-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-32">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
            <span className="text-purple-200 tracking-widest uppercase">Your Journey Begins Here</span>
            <Sparkles className="w-8 h-8 text-purple-300 animate-pulse" />
          </div>
          
          <h1 className="text-7xl mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Toyota Galaxy
          </h1>
          
          <p className="text-2xl text-purple-100 mb-4">
            Navigate the Universe of Auto Financing
          </p>
          
          <p className="text-xl text-purple-200 mb-12 max-w-2xl">
            Let the stars guide you to your perfect Toyota. 
            Discover which vehicle aligns with your cosmic personality.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/30 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">⭐</div>
              <h3 className="text-xl mb-2 text-white">Cosmic Match</h3>
              <p className="text-purple-200">Find your perfect car by zodiac sign</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/30 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl mb-2 text-white">Smart Calculator</h3>
              <p className="text-purple-200">Estimate lease & loan payments instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-purple-300/30 hover:bg-white/20 transition-all">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="text-xl mb-2 text-white">Wide Selection</h3>
              <p className="text-purple-200">Browse Toyota vehicles across Texas</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
