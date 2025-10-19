import { Star } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentPage: 'home' | 'leasing' | 'loaning' | 'compare';
  onNavigate: (page: 'home' | 'leasing' | 'loaning' | 'compare') => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-indigo-950/80 backdrop-blur-md border-b border-purple-500/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Star className="w-6 h-6 text-purple-300" />
            <span className="text-xl bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              Toyota Galaxy
            </span>
          </button>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => onNavigate('home')}
              className={
                currentPage === 'home'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
              }
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'leasing' ? 'default' : 'ghost'}
              onClick={() => onNavigate('leasing')}
              className={
                currentPage === 'leasing'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
              }
            >
              Leasing
            </Button>
            <Button
              variant={currentPage === 'loaning' ? 'default' : 'ghost'}
              onClick={() => onNavigate('loaning')}
              className={
                currentPage === 'loaning'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
              }
            >
              Loaning
            </Button>
            <Button
              variant={currentPage === 'compare' ? 'default' : 'ghost'}
              onClick={() => onNavigate('compare')}
              className={
                currentPage === 'compare'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
              }
            >
              Compare
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
