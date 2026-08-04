import React, { useState, useEffect } from 'react';

export default function Pengembalian({ onLogout, onNavigate }) {
  // 1. Ambil data dari LocalStorage yang tersimpan dari Peminjaman
  const [semuaPeminjaman, setSemuaPeminjaman] = useState(() => {
    const savedData = localStorage.getItem('dataPeminjaman');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Jika masih kosong / belum ada interaksi
    return [
      { id: 'TRX001', nama: 'Andi Pratama', buku: 'Laskar Pelangi', tglPinjam: '15/06/2026', tglKembali: '22/06/2026', status: 'Dipinjam' },
      { id: 'TRX002', nama: 'Siti Aminah', buku: 'Bumi', tglPinjam: '14/06/2026', tglKembali: '21/06/2026', status: 'Dipinjam' },
      { id: 'TRX003', nama: 'Rudi Hermawan', buku: 'Ensiklopedi Sains', tglPinjam: '10/06/2026', tglKembali: '17/06/2026', status: 'Terlambat' },
    ];
  });

  // 2. Simpan kembali ke LocalStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('dataPeminjaman', JSON.stringify(semuaPeminjaman));
  }, [semuaPeminjaman]);

  // 3. Filter data: Hanya tampilkan yang belum dikembalikan
  const daftarAktif = semuaPeminjaman.filter(item => item.status !== 'Dikembalikan');

  // 4. Fungsi untuk memproses pengembalian buku
  const handleKembalikan = (id) => {
    // Konfirmasi sebelum mengubah status
    const isConfirm = window.confirm('Apakah Anda yakin ingin menyelesaikan pengembalian buku ini?');
    if (!isConfirm) return;

    // Cari item yang sesuai dan ubah statusnya menjadi 'Dikembalikan'
    const updatedData = semuaPeminjaman.map(item => {
      if (item.id === id) {
        return { ...item, status: 'Dikembalikan' };
      }
      return item;
    });

    // Update state, yang otomatis men-trigger useEffect untuk simpan ke LocalStorage
    setSemuaPeminjaman(updatedData);
    alert('Buku berhasil dikembalikan!');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800 w-full">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between z-10 hidden md:flex">
        <div>
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></svg>
            </div>
            <div>
              <h2 className="font-bold text-blue-700 leading-tight">SD Negeri 1</h2>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider">SEMIRING</p>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1">
            <button onClick={() => onNavigate('dashboard')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </button>
            <button onClick={() => onNavigate('manajemen-buku')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              Manajemen Buku
            </button>
            <button onClick={() => onNavigate('data-anggota')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Data Anggota
            </button>
            <button onClick={() => onNavigate('peminjaman')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              Peminjaman
            </button>

            {/* Menu Aktif */}
            <button onClick={() => onNavigate('pengembalian')} className="flex w-full items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-left shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
              Pengembalian
            </button>

            <button onClick={() => onNavigate('laporan')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Laporan
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button onClick={onLogout} className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl font-medium text-left transition-colors w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-8 w-full shrink-0 z-0">
          <h1 className="text-xl font-bold text-blue-600">Perpustakaan</h1>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-bold text-sm text-slate-800">Admin Petugas</p>
              <p className="text-xs text-slate-500">Librarian</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E5ECA9] text-slate-800 font-bold flex items-center justify-center">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 w-full">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Pengembalian Buku</h2>
            <p className="text-slate-500 text-sm mt-1">Daftar peminjaman aktif yang menunggu pengembalian</p>
          </div>

          <div className="mb-8">
            <div className="relative w-full sm:max-w-[400px]">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </div>
              <input 
                type="text" 
                placeholder="Cari peminjam atau judul buku..." 
                className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Daftar Kartu Pengembalian */}
          <div className="flex flex-col gap-4 w-full">
            {daftarAktif.length > 0 ? (
              daftarAktif.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all w-full">
                  
                  <div className="flex items-start sm:items-center gap-4 sm:gap-5">
                    {/* Icon Indikator */}
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${item.status === 'Terlambat' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                      {item.status === 'Terlambat' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-0.5">
                        <h3 className="font-bold text-slate-800 text-[17px]">{item.nama}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${item.status === 'Terlambat' ? 'bg-[#f44336] text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-blue-500 font-medium text-sm mb-1">{item.buku}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-slate-500">
                        <p>Pinjam: <span className="font-medium text-slate-600">{item.tglPinjam}</span></p>
                        <p className={item.status === 'Terlambat' ? 'text-red-500 font-semibold' : ''}>
                          Batas Kembali: {item.tglKembali}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* EVENT PADA TOMBOL */}
                  <button 
                    onClick={() => handleKembalikan(item.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors shadow-sm w-full sm:w-auto shrink-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    Kembalikan
                  </button>
                  
                </div>
              ))
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
                <p className="text-slate-500 font-medium">Hore! Semua buku sudah dikembalikan.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}