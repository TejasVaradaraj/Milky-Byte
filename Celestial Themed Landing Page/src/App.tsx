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
    <div className="min-h-screen">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'leasing' && <LeasingPage />}
      {currentPage === 'loaning' && <LoaningPage />}
    </div>
  );
}
