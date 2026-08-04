import React, { useState, useEffect } from 'react';

export default function Peminjaman({ onLogout, onNavigate }) {
  // State untuk Peminjaman Aktif
  const [peminjamanAktif, setPeminjamanAktif] = useState(() => {
    const savedData = localStorage.getItem('dataPeminjaman');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return [];
  });

  // State untuk Data Dropdown Dinamis
  const [daftarAnggota, setDaftarAnggota] = useState([]);
  const [daftarBuku, setDaftarBuku] = useState([]);

  // State untuk Input Form
  const [anggota, setAnggota] = useState('');
  const [buku, setBuku] = useState('');
  const [tglPinjam, setTglPinjam] = useState('');
  const [durasi, setDurasi] = useState(7);

  // Mengambil data Anggota dan Buku dari localStorage saat halaman dimuat
  useEffect(() => {
    // Ambil data anggota
    const savedAnggota = localStorage.getItem('dataAnggota');
    if (savedAnggota) {
      setDaftarAnggota(JSON.parse(savedAnggota));
    } else {
      setDaftarAnggota([]);
    }

    // Ambil data buku
    const savedBuku = localStorage.getItem('dataBuku');
    if (savedBuku) {
      setDaftarBuku(JSON.parse(savedBuku));
    } else {
      setDaftarBuku([]);
    }
  }, []);

  // Simpan data Peminjaman ke localStorage setiap ada perubahan
  useEffect(() => {
    localStorage.setItem('dataPeminjaman', JSON.stringify(peminjamanAktif));
    // Trigger storage event untuk halaman lain (Dashboard, Laporan)
    window.dispatchEvent(new Event('storage'));
  }, [peminjamanAktif]);

  // Fungsi untuk format tanggal ke DD/MM/YYYY
  const formatTanggal = (dateObj) => {
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const y = dateObj.getFullYear();
    return `${d}/${m}/${y}`;
  };

  const handleTambahPeminjaman = (e) => {
    e.preventDefault();

    if (!anggota || !buku || !tglPinjam) {
      alert("Mohon lengkapi data anggota, buku, dan tanggal pinjam!");
      return;
    }

    const pinjamDateObj = new Date(tglPinjam);
    const kembaliDateObj = new Date(pinjamDateObj);
    kembaliDateObj.setDate(pinjamDateObj.getDate() + parseInt(durasi));

    // === INI YANG PENTING: Buat timestamp REAL TIME ===
    const now = new Date();
    const timestamp = now.getTime(); // Miliseconds sejak 1970
    
    // Buat ID unik berdasarkan timestamp
    const newId = `TRX${timestamp}`;
    
    // Format tanggal pinjam yang dipilih user
    const tglPinjamFormatted = formatTanggal(pinjamDateObj);
    const tglKembaliFormatted = formatTanggal(kembaliDateObj);

    const transaksiBaru = {
      id: newId,
      nama: anggota.split(' (')[0],
      buku: buku,
      tglPinjam: tglPinjamFormatted,
      tglKembali: tglKembaliFormatted,
      status: 'Dipinjam',
      timestamp: timestamp, // TIMESTAMP untuk sorting dan hitung waktu
      createdAt: now.toISOString() // Backup dalam format ISO
    };

    console.log('Transaksi baru:', transaksiBaru); // Debugging

    setPeminjamanAktif([transaksiBaru, ...peminjamanAktif]);

    // Reset form
    setAnggota('');
    setBuku('');
    setTglPinjam('');
    setDurasi(7);
    
    alert('✓ Peminjaman berhasil dicatat!');
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
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
            <button onClick={() => onNavigate('peminjaman')} className="flex w-full items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-left">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
              Peminjaman
            </button>
            <button onClick={() => onNavigate('pengembalian')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
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
          <button onClick={onLogout} className="flex items-center gap-3 text-red-500 hover:bg-red-50 px-4 py-3 rounded-xl font-medium transition-colors w-full text-left">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            Keluar
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 flex flex-col w-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 w-full shrink-0">
          <h1 className="text-xl font-bold text-blue-600">Perpustakaan</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm text-slate-800">Admin Petugas</p>
              <p className="text-xs text-slate-500">Librarian</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E5ECA9] text-slate-800 font-bold flex items-center justify-center">AD</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-600">Peminjaman Buku</h2>
            <p className="text-slate-500 text-sm mt-1">Catat sirkulasi peminjaman buku perpustakaan sekolah</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Catat Pinjaman */}
            <div className="col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-fit">
              <h3 className="text-lg font-bold mb-4 text-slate-700 border-b border-slate-100 pb-2">Catat Pinjaman Baru</h3>
              
              <form className="flex flex-col gap-4" onSubmit={handleTambahPeminjaman}>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Pilih Anggota</label>
                  <select 
                    value={anggota} 
                    onChange={(e) => setAnggota(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Pilih Anggota --</option>
                    {daftarAnggota.map((item, index) => (
                      <option key={index} value={`${item.nama} (${item.nis})`}>
                        {item.nama} ({item.nis})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Pilih Buku</label>
                  <select 
                    value={buku}
                    onChange={(e) => setBuku(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">-- Pilih Judul Buku --</option>
                    {daftarBuku.map((item, index) => (
                      <option key={index} value={item.judul}>
                        {item.judul}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Tanggal Pinjam</label>
                  <input 
                    type="date" 
                    value={tglPinjam}
                    onChange={(e) => setTglPinjam(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Durasi (Hari)</label>
                  <input 
                    type="number" 
                    value={durasi}
                    onChange={(e) => setDurasi(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                  />
                </div>
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold text-sm shadow-sm transition-colors mt-2">
                  Simpan Transaksi
                </button>
              </form>
            </div>

            {/* Tabel Daftar Peminjaman Aktif */}
            <div className="col-span-1 lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
              <div className="p-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-bold text-slate-700">Daftar Peminjaman Aktif</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-medium">Siswa / Anggota</th>
                      <th className="px-6 py-4 font-medium">Buku</th>
                      <th className="px-6 py-4 font-medium">Pinjam</th>
                      <th className="px-6 py-4 font-medium">Batas Kembali</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {peminjamanAktif.map((trx, index) => (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{trx.nama}</td>
                        <td className="px-6 py-4 text-slate-600">{trx.buku}</td>
                        <td className="px-6 py-4 text-slate-500">{trx.tglPinjam}</td>
                        <td className="px-6 py-4 text-slate-500">{trx.tglKembali}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${trx.status === 'Dipinjam' ? 'bg-blue-100 text-blue-600' : trx.status === 'Dikembalikan' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    
                    {peminjamanAktif.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">Belum ada data peminjaman</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}