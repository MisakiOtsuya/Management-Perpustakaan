import React, { useState, useEffect } from 'react';

export default function Dashboard({ onLogout, onNavigate }) {
  const [totalBuku, setTotalBuku] = useState(0);
  const [totalAnggota, setTotalAnggota] = useState(0);
  const [bukuDipinjam, setBukuDipinjam] = useState(0);
  const [peminjamanBaru, setPeminjamanBaru] = useState(0);
  const [aktivitasTerakhir, setAktivitasTerakhir] = useState([]);
  const [bukuTerlambat, setBukuTerlambat] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  const [persentaseBuku, setPersentaseBuku] = useState(0);
  const [persentaseAnggota, setPersentaseAnggota] = useState(0);
  const [persentaseDipinjam, setPersentaseDipinjam] = useState(0);
  const [persentaseBaru, setPersentaseBaru] = useState(0);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const hitungWaktuLalu = (timestamp) => {
    if (!timestamp) return 'baru saja';
    
    const now = Date.now();
    const diffMs = now - timestamp;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays === 1) return 'kemarin';
    return `${diffDays} hari yang lalu`;
  };

  const hitungPersentase = (nilai, target) => {
    if (target === 0) return 0;
    return Math.min((nilai / target) * 100, 100);
  };

  const getProgressColor = (persen) => {
    if (persen >= 80) return 'bg-emerald-500';
    if (persen >= 50) return 'bg-blue-500';
    if (persen >= 20) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status) => {
    if (status === 'Dipinjam') {
      return <span className="bg-amber-100 text-amber-600 text-xs font-medium px-3 py-1 rounded-md">Dipinjam</span>;
    } else if (status === 'Terlambat') {
      return <span className="bg-red-100 text-red-600 text-xs font-medium px-3 py-1 rounded-md">Terlambat</span>;
    } else if (status === 'Dikembalikan') {
      return <span className="bg-emerald-100 text-emerald-600 text-xs font-medium px-3 py-1 rounded-md">Dikembalikan</span>;
    }
    return <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-md">{status}</span>;
  };

  const getActivityIcon = (status) => {
    if (status === 'Dipinjam') {
      return (
        <div className="bg-amber-50 text-amber-500 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
      );
    } else if (status === 'Terlambat') {
      return (
        <div className="bg-red-50 text-red-500 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
      );
    } else {
      return (
        <div className="bg-emerald-50 text-emerald-500 p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
      );
    }
  };

  const loadData = () => {
    console.log('🔄 Loading data from localStorage...', new Date().toLocaleTimeString());
    
    const savedBuku = localStorage.getItem('dataBuku');
    let dataBuku = [];
    if (savedBuku) {
      try {
        dataBuku = JSON.parse(savedBuku);
        if (!Array.isArray(dataBuku)) dataBuku = [];
      } catch (e) {
        console.error('Error parsing dataBuku:', e);
      }
    }
    const totalBukuCount = dataBuku.reduce((sum, buku) => sum + (buku.stok || 0), 0);
    setTotalBuku(totalBukuCount);

    const savedAnggota = localStorage.getItem('dataAnggota');
    let dataAnggota = [];
    if (savedAnggota) {
      try {
        dataAnggota = JSON.parse(savedAnggota);
        if (!Array.isArray(dataAnggota)) dataAnggota = [];
      } catch (e) {
        console.error('Error parsing dataAnggota:', e);
      }
    }
    setTotalAnggota(dataAnggota.length);

    const savedPeminjaman = localStorage.getItem('dataPeminjaman');
    let dataPeminjaman = [];
    if (savedPeminjaman) {
      try {
        dataPeminjaman = JSON.parse(savedPeminjaman);
        if (!Array.isArray(dataPeminjaman)) dataPeminjaman = [];
      } catch (e) {
        console.error('Error parsing dataPeminjaman:', e);
      }
    }

    const dipinjam = dataPeminjaman.filter(item => item.status === 'Dipinjam' || item.status === 'Terlambat').length;
    setBukuDipinjam(dipinjam);

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const peminjamanBaruCount = dataPeminjaman.filter(item => {
      const itemTime = item.timestamp || 0;
      return itemTime >= sevenDaysAgo;
    }).length;
    setPeminjamanBaru(peminjamanBaruCount);

    const terlambat = dataPeminjaman.filter(item => item.status === 'Terlambat').length;
    setBukuTerlambat(terlambat);

    setPersentaseBuku(hitungPersentase(totalBukuCount, 5000));
    setPersentaseAnggota(hitungPersentase(dataAnggota.length, 1000));
    setPersentaseDipinjam(hitungPersentase(dipinjam, totalBukuCount || 1));
    setPersentaseBaru(hitungPersentase(peminjamanBaruCount, 50));

    let aktivitas = [];
    if (dataPeminjaman.length > 0) {
      const validItems = dataPeminjaman.filter(item => item && item.id && item.timestamp);
      validItems.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
      aktivitas = validItems.slice(0, 6).map(item => ({
        id: item.id,
        nama: item.nama || 'Unknown',
        buku: item.buku || 'Unknown',
        tglPinjam: item.tglPinjam || '-',
        status: item.status || 'Unknown',
        timestamp: item.timestamp,
        waktuLalu: hitungWaktuLalu(item.timestamp)
      }));
    }
    
    setAktivitasTerakhir(aktivitas);
    setLastUpdate(new Date());
    console.log(`✅ Data loaded: ${dataBuku.length} buku, ${dataAnggota.length} anggota, ${dataPeminjaman.length} peminjaman`);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'dataPeminjaman' || e.key === 'dataBuku' || e.key === 'dataAnggota') {
        console.log('📦 Storage event detected:', e.key);
        loadData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(() => {
      loadData();
    }, 2000);
    
    const handleFocus = () => {
      console.log('📱 Window focused, refreshing data...');
      loadData();
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-blue-700 leading-tight">SD Negeri 1</h2>
              <p className="text-[10px] text-slate-500 font-semibold tracking-wider">SEMIRING</p>
            </div>
          </div>

          <nav className="p-4 flex flex-col gap-1">
            <button onClick={() => onNavigate('dashboard')} className="flex w-full items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
              Dashboard
            </button>
            <button onClick={() => onNavigate('manajemen-buku')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
              Manajemen Buku
            </button>
            <button onClick={() => onNavigate('data-anggota')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Data Anggota
            </button>
            <button onClick={() => onNavigate('peminjaman')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              Peminjaman
            </button>
            <button onClick={() => onNavigate('pengembalian')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
              Pengembalian
            </button>
            <button onClick={() => onNavigate('laporan')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium transition-colors text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
              Laporan
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200">
          <button onClick={onLogout} className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-blue-600">Perpustakaan</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm text-slate-800">Admin Petugas</p>
              <p className="text-xs text-slate-500">Librarian</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E5ECA9] text-slate-800 font-bold flex items-center justify-center">AD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-blue-600">Selamat Datang, Admin!</h2>
            <p className="text-slate-500 mt-1">Hari ini adalah {formattedDate}</p>
            <p className="text-xs text-green-600 mt-1">
              ✅ Data realtime dari localStorage - update setiap 2 detik
              <span className="text-slate-400 ml-2">(terakhir: {lastUpdate.toLocaleTimeString()})</span>
            </p>
          </div>

          {/* Statistik Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-slate-500 font-medium">Total Buku</p>
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{totalBuku.toLocaleString()}</h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                <div className={`${getProgressColor(persentaseBuku)} h-2 rounded-full transition-all duration-500`} style={{ width: `${persentaseBuku}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500">{persentaseBuku.toFixed(1)}% dari target 5.000</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-slate-500 font-medium">Total Anggota</p>
                <div className="bg-emerald-100 text-emerald-500 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{totalAnggota}</h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                <div className={`${getProgressColor(persentaseAnggota)} h-2 rounded-full transition-all duration-500`} style={{ width: `${persentaseAnggota}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500">{persentaseAnggota.toFixed(1)}% dari target 1.000</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-slate-500 font-medium">Buku Dipinjam</p>
                <div className="bg-amber-100 text-amber-500 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{bukuDipinjam}</h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                <div className={`${getProgressColor(persentaseDipinjam)} h-2 rounded-full transition-all duration-500`} style={{ width: `${persentaseDipinjam}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500">{persentaseDipinjam.toFixed(1)}% dari total koleksi</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-slate-500 font-medium">Peminjaman Baru</p>
                <div className="bg-purple-100 text-purple-500 p-2 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
              </div>
              <h3 className="text-3xl font-bold mb-2">{peminjamanBaru}</h3>
              <div className="w-full bg-slate-100 h-2 rounded-full mb-2 overflow-hidden">
                <div className={`${getProgressColor(persentaseBaru)} h-2 rounded-full transition-all duration-500`} style={{ width: `${persentaseBaru}%` }}></div>
              </div>
              <p className="text-[10px] text-slate-500">{persentaseBaru.toFixed(1)}% target 50/minggu</p>
            </div>
          </div>

          {/* Aktivitas Terakhir & Aksi Cepat */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Aktivitas Terakhir</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-blue-500 flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    Live
                  </span>
                  <button onClick={loadData} className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <path d="M23 4v6h-6"/>
                      <path d="M1 20v-6h6"/>
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Refresh
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col">
                {aktivitasTerakhir.length > 0 ? (
                  aktivitasTerakhir.map((item, index) => (
                    <div key={item.id || index} className={`flex items-center justify-between py-4 ${index !== aktivitasTerakhir.length - 1 ? 'border-b border-slate-100' : ''} hover:bg-slate-50/50 transition-colors rounded-lg px-2 -mx-2`}>
                      <div className="flex items-center gap-4">
                        {getActivityIcon(item.status)}
                        <div>
                          <p className="text-sm text-slate-800">
                            <span className="font-semibold">{item.nama}</span>
                            <span className="mx-1 text-slate-400">•</span>
                            {item.status === 'Dipinjam' && <span>meminjam <span className="font-medium text-blue-600">"{item.buku}"</span></span>}
                            {item.status === 'Dikembalikan' && <span>mengembalikan <span className="font-medium text-emerald-600">"{item.buku}"</span></span>}
                            {item.status === 'Terlambat' && <span>terlambat mengembalikan <span className="font-medium text-red-600">"{item.buku}"</span></span>}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>📅 {item.tglPinjam || '-'}</span>
                            <span className="text-blue-500">⏱️ {item.waktuLalu}</span>
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 mx-auto mb-3 text-slate-300">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                    <p>Belum ada aktivitas peminjaman</p>
                    <p className="text-xs mt-2">Silakan tambah peminjaman di halaman Peminjaman</p>
                  </div>
                )}
              </div>
            </div>

            {/* Aksi Cepat - SOLID */}
            <div className="col-span-1 bg-blue-600 rounded-xl shadow-md p-6 text-white flex flex-col">
              <h3 className="text-xl font-bold mb-6">Aksi Cepat</h3>
              
              <button 
                onClick={() => onNavigate('manajemen-buku')} 
                className="bg-blue-700 hover:bg-blue-800 transition-colors text-left px-4 py-3.5 rounded-xl mb-3 flex items-center gap-3 text-sm font-medium w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Tambah Buku Baru
              </button>
              
              <button 
                onClick={() => onNavigate('data-anggota')}
                className="bg-blue-700 hover:bg-blue-800 transition-colors text-left px-4 py-3.5 rounded-xl mb-3 flex items-center gap-3 text-sm font-medium w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Daftarkan Anggota
              </button>
              
              <button 
                onClick={() => onNavigate('peminjaman')}
                className="bg-blue-700 hover:bg-blue-800 transition-colors text-left px-4 py-3.5 rounded-xl mb-3 flex items-center gap-3 text-sm font-medium w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="7" y1="17" x2="17" y2="7"></line>
                  <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
                Catat Peminjaman
              </button>

              <button 
                onClick={() => onNavigate('pengembalian')}
                className="bg-blue-700 hover:bg-blue-800 transition-colors text-left px-4 py-3.5 rounded-xl mb-6 flex items-center gap-3 text-sm font-medium w-full"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="17" y1="7" x2="7" y2="17"></line>
                  <polyline points="17 17 7 17 7 7"></polyline>
                </svg>
                Proses Pengembalian
              </button>

              <div className="mt-auto pt-6">
                <div className="bg-[#E5ECA9] text-slate-800 p-4 rounded-xl">
                  <p className="text-[10px] font-bold tracking-wider mb-1">PENGINGAT</p>
                  <p className="text-sm font-medium leading-snug">
                    Ada {bukuTerlambat} buku yang melewati batas waktu pengembalian.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}