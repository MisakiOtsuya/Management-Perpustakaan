import React, { useState, useEffect } from 'react';

export default function DataAnggota({ onLogout, onNavigate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Inisialisasi state dengan mengecek localStorage terlebih dahulu
  const [dataAnggota, setDataAnggota] = useState(() => {
    const savedData = localStorage.getItem('dataAnggota');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Data default jika belum ada data di memori
    return [
      { inisial: 'AP', nama: 'Andi Pratama', nis: '2024001', kelas: '5A', tipe: 'Siswa', terdaftar: '12/1/2024' },
      { inisial: 'SA', nama: 'Siti Aminah', nis: '2024002', kelas: '4B', tipe: 'Siswa', terdaftar: '15/1/2024' },
      { inisial: 'RH', nama: 'Rudi Hermawan', nis: '2024003', kelas: '6C', tipe: 'Siswa', terdaftar: '1/2/2024' },
      { inisial: 'BS', nama: 'Budi Santoso', nis: '2024004', kelas: '-', tipe: 'Guru', terdaftar: '20/8/2023' },
      { inisial: 'DL', nama: 'Dewi Lestari', nis: '2024005', kelas: '3A', tipe: 'Siswa', terdaftar: '10/2/2024' },
    ];
  });

  // 2. State untuk menangani inputan form
  const [nama, setNama] = useState('');
  const [nis, setNis] = useState('');
  const [tipe, setTipe] = useState('Siswa');
  const [kelas, setKelas] = useState('');

  // 3. Simpan data ke localStorage setiap ada perubahan pada dataAnggota
  useEffect(() => {
    localStorage.setItem('dataAnggota', JSON.stringify(dataAnggota));
  }, [dataAnggota]);

  // 4. Fungsi Menambahkan Anggota Baru
  const handleTambahAnggota = (e) => {
    e.preventDefault();

    // Validasi sederhana
    if (!nama || !nis) {
      alert("Mohon lengkapi Nama dan NIS!");
      return;
    }

    // Fungsi untuk membuat inisial (mengambil 1 huruf pertama dari 2 kata pertama)
    const words = nama.trim().split(' ');
    let inisial = '';
    if (words.length >= 2) {
      inisial = (words[0][0] + words[1][0]).toUpperCase();
    } else {
      inisial = nama.substring(0, 2).toUpperCase();
    }

    // Mendapatkan tanggal hari ini
    const today = new Date();
    const terdaftar = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    // Objek anggota baru
    const anggotaBaru = {
      inisial,
      nama,
      nis,
      kelas: tipe === 'Guru' ? '-' : kelas || '-', // Guru otomatis strip
      tipe,
      terdaftar
    };

    // Update state 
    setDataAnggota([anggotaBaru, ...dataAnggota]);

    // Kosongkan form dan tutup modal
    setNama('');
    setNis('');
    setTipe('Siswa');
    setKelas('');
    setIsModalOpen(false);
  };

  // 5. Fungsi Menghapus Anggota
  const handleHapusAnggota = (nisTarget) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus anggota ini dari sistem?");
    if (konfirmasi) {
      const dataTerbaru = dataAnggota.filter(anggota => anggota.nis !== nisTarget);
      setDataAnggota(dataTerbaru);
    }
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
            <button onClick={() => onNavigate('data-anggota')} className="flex w-full items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-left shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              Data Anggota
            </button>
            <button onClick={() => onNavigate('peminjaman')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
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
      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Data Anggota</h2>
              <p className="text-slate-500 text-sm mt-1">Daftar siswa dan guru yang terdaftar sebagai anggota perpustakaan</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Tambah Anggota
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input type="text" placeholder="Cari nama atau NIS anggota..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Anggota</th>
                    <th className="px-6 py-4 font-medium">NIS/ID</th>
                    <th className="px-6 py-4 font-medium">Kelas</th>
                    <th className="px-6 py-4 font-medium">Tipe</th>
                    <th className="px-6 py-4 font-medium">Terdaftar</th>
                    <th className="px-6 py-4 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataAnggota.map((anggota, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">{anggota.inisial}</div>
                          <span className="font-medium text-slate-700">{anggota.nama}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{anggota.nis}</td>
                      <td className="px-6 py-4 text-slate-600">{anggota.kelas}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${anggota.tipe === 'Siswa' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>{anggota.tipe}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{anggota.terdaftar}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                          </button>
                          {/* Tombol Hapus memanggil fungsi handleHapusAnggota */}
                          <button 
                            onClick={() => handleHapusAnggota(anggota.nis)}
                            className="text-red-500 hover:text-red-700 transition-colors" 
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dataAnggota.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada data anggota</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ================= MODAL TAMBAH ANGGOTA ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Tambah Anggota Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Daftarkan siswa atau guru ke sistem perpustakaan.</p>
            
            {/* Form disambungkan ke fungsi handleTambahAnggota */}
            <form className="flex flex-col gap-4" onSubmit={handleTambahAnggota}>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap" 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Nomor Induk (NIS/NIP)</label>
                <input 
                  type="text" 
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  placeholder="Contoh: 2024001" 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Tipe Anggota</label>
                  <select 
                    value={tipe}
                    onChange={(e) => setTipe(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white outline-none"
                  >
                    <option value="Siswa">Siswa</option>
                    <option value="Guru">Guru</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Kelas</label>
                  <input 
                    type="text" 
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    disabled={tipe === 'Guru'} // Jika guru, disable isian kelas
                    placeholder={tipe === 'Guru' ? "-" : "Contoh: 5A"} 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100" 
                  />
                </div>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3.5 rounded-xl font-bold text-sm mt-4 shadow-lg transition-colors">
                Simpan Anggota
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}