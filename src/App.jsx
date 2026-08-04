import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ManajemenBuku from './pages/ManajemenBuku';
import DataAnggota from './pages/DataAnggota';
import Peminjaman from './pages/Peminjaman';
import Pengembalian from './pages/Pengembalian';
import Laporan from './pages/Laporan'; // Import halaman Laporan

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  // Pengatur Jalur Alur Sistem Informasi Perpustakaan (Routing)
  if (currentPage === 'manajemen-buku') {
    return <ManajemenBuku onLogout={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
  }
  
  if (currentPage === 'data-anggota') {
    return <DataAnggota onLogout={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'peminjaman') {
    return <Peminjaman onLogout={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'pengembalian') {
    return <Pengembalian onLogout={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'laporan') {
    return <Laporan onLogout={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
  }

  return <Dashboard onLogout={() => setIsLoggedIn(false)} onNavigate={setCurrentPage} />;
}

export default App;