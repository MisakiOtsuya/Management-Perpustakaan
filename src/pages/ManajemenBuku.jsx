import React, { useState, useEffect } from 'react';

export default function ManajemenBuku({ onLogout, onNavigate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1. Inisialisasi State dengan mengambil data dari localStorage terlebih dahulu
  const [dataBuku, setDataBuku] = useState(() => {
    const savedData = localStorage.getItem('dataBuku');
    if (savedData) {
      return JSON.parse(savedData);
    }
    // Data bawaan jika belum ada data di memori
    return [
      { kode: 'B001', judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', kategori: 'Fiksi', stok: 5 },
      { kode: 'B002', judul: 'Bumi', pengarang: 'Tere Liye', kategori: 'Novel', stok: 3 },
      { kode: 'B003', judul: 'Matematika SD Kelas 4', pengarang: 'Tim Edukasi', kategori: 'Pelajaran', stok: 12 },
      { kode: 'B004', judul: 'Kamus Indonesia-Inggris', pengarang: 'Hassan Shadily', kategori: 'Referensi', stok: 8 },
      { kode: 'B005', judul: 'Ensiklopedi Sains', pengarang: 'Robert Winston', kategori: 'Sains', stok: 4 },
    ];
  });

  // 2. State untuk menampung inputan form tambah buku
  const [judul, setJudul] = useState('');
  const [kode, setKode] = useState('');
  const [stok, setStok] = useState('');
  const [pengarang, setPengarang] = useState('');
  const [kategori, setKategori] = useState('Pelajaran'); // Default kategori

  // 3. Simpan perubahan ke localStorage agar terhubung dengan halaman Peminjaman
  useEffect(() => {
    localStorage.setItem('dataBuku', JSON.stringify(dataBuku));
  }, [dataBuku]);

  // 4. Fungsi untuk memproses penambahan buku baru
  const handleTambahBuku = (e) => {
    e.preventDefault(); // Mencegah form reload halaman

    // Validasi input tidak boleh kosong
    if (!judul || !kode || !stok || !pengarang) {
      alert("Mohon lengkapi semua data buku (Judul, Kode, Stok, dan Pengarang)!");
      return;
    }

    const bukuBaru = {
      kode,
      judul,
      pengarang,
      kategori,
      stok: parseInt(stok) // Pastikan stok tersimpan sebagai angka
    };

    // Update state tabel (tambahkan buku baru di urutan teratas)
    setDataBuku([bukuBaru, ...dataBuku]);

    // Kosongkan isian form dan tutup modal
    setJudul('');
    setKode('');
    setStok('');
    setPengarang('');
    setKategori('Pelajaran');
    setIsModalOpen(false);
  };

  // 5. Fungsi untuk menghapus buku
  const handleHapusBuku = (kodeTarget) => {
    const konfirmasi = window.confirm("Apakah Anda yakin ingin menghapus buku ini dari sistem?");
    if (konfirmasi) {
      // Filter buku, buang buku yang kodenya sama dengan target
      const dataTerbaru = dataBuku.filter(buku => buku.kode !== kodeTarget);
      setDataBuku(dataTerbaru);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800 w-full">
      
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
            <button onClick={() => onNavigate('manajemen-buku')} className="flex w-full items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-left shadow-sm">
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
              <h2 className="text-2xl font-bold text-blue-600">Data Buku</h2>
              <p className="text-slate-500 text-sm mt-1">Manajemen inventaris koleksi buku perpustakaan</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Tambah Buku
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex gap-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-slate-400"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                <input type="text" placeholder="Cari judul buku atau pengarang..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Kode</th>
                    <th className="px-6 py-4 font-medium">Judul Buku</th>
                    <th className="px-6 py-4 font-medium">Pengarang</th>
                    <th className="px-6 py-4 font-medium">Kategori</th>
                    <th className="px-6 py-4 font-medium">Stok</th>
                    <th className="px-6 py-4 font-medium text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataBuku.map((buku, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-700">{buku.kode}</td>
                      <td className="px-6 py-4 text-slate-700">{buku.judul}</td>
                      <td className="px-6 py-4 text-slate-500">{buku.pengarang}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">{buku.kategori}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{buku.stok}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button className="text-blue-500 hover:text-blue-700 transition-colors" title="Edit">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                          </button>
                          {/* Tombol hapus memanggil fungsi handleHapusBuku */}
                          <button 
                            onClick={() => handleHapusBuku(buku.kode)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Hapus"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {dataBuku.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400">Belum ada data buku</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* ================= MODAL TAMBAH BUKU ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Tambah Buku Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            {/* Form submit disambungkan ke fungsi handleTambahBuku */}
            <form className="flex flex-col gap-4" onSubmit={handleTambahBuku}>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-1 block">Judul Buku</label>
                <input 
                  type="text" 
                  value={judul}
                  onChange={(e) => setJudul(e.target.value)}
                  placeholder="Masukkan judul buku" 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Kode Buku</label>
                  <input 
                    type="text" 
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    placeholder="Contoh: B006" 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Stok</label>
                  <input 
                    type="number" 
                    value={stok}
                    onChange={(e) => setStok(e.target.value)}
                    placeholder="0" 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-[2]">
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Pengarang</label>
                  <input 
                    type="text" 
                    value={pengarang}
                    onChange={(e) => setPengarang(e.target.value)}
                    placeholder="Masukkan nama pengarang" 
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-bold text-slate-700 mb-1 block">Kategori</label>
                  <select 
                    value={kategori}
                    onChange={(e) => setKategori(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Pelajaran">Pelajaran</option>
                    <option value="Fiksi">Fiksi</option>
                    <option value="Novel">Novel</option>
                    <option value="Sains">Sains</option>
                    <option value="Referensi">Referensi</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3.5 rounded-xl font-bold text-sm mt-4 shadow-lg transition-colors">
                Simpan Buku
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}