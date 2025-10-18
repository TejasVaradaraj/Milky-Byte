import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { LeasingPage } from './components/LeasingPage';
import { LoaningPage } from './components/LoaningPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'leasing' | 'loaning'>('home');

  const handleNavigate = (page: 'home' | 'leasing' | 'loaning') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Starry Background - Realistic Night Sky */}
      <div className="starry-background"></div>
      
      <style>{`
        /* Starfield with multiple layers for realistic look */
        .starry-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          background-image:
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 1px, transparent 1px),
            radial-gradient(white 1px, transparent 1px);
          background-size: 50px 50px, 100px 100px, 150px 150px;
          background-position: 0 0, 25px 50px, 50px 25px;
          animation: twinkle 5s infinite alternate;
          z-index: 0;
          pointer-events: none;
        }

        /* Subtle twinkle effect */
        @keyframes twinkle {
          from {
            opacity: 0.8;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>

      <div className="relative z-10">
        <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
        
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'leasing' && <LeasingPage />}
        {currentPage === 'loaning' && <LoaningPage />}
      </div>
    </div>
  );
}
