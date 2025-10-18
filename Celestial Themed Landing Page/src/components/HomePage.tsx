import { HeroSection } from './HeroSection';
import { ScrollingBar } from './ScrollingBar';
import { ZodiacCarFinder } from './ZodiacCarFinder';

export function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Scrolling Bar */}
      <ScrollingBar />

      {/* Cosmic Car Match Section */}
      <ZodiacCarFinder />

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
