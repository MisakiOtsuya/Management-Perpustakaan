import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

export default function Laporan({ onLogout, onNavigate }) {
  // State untuk menyimpan data realtime
  const [logPeminjaman, setLogPeminjaman] = useState([]);
  const [dataBuku, setDataBuku] = useState([]);
  const [dataAnggota, setDataAnggota] = useState([]);
  const [statistik, setStatistik] = useState({
    totalPeminjaman: 0,
    bukuTerpopuler: [],
    totalAnggota: 0,
    peminjamanBulanIni: 0
  });

  // State untuk filter
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fungsi untuk mengambil semua data dari localStorage
  const loadData = () => {
    // Ambil data peminjaman
    const savedPeminjaman = localStorage.getItem('dataPeminjaman');
    if (savedPeminjaman) {
      setLogPeminjaman(JSON.parse(savedPeminjaman));
    } else {
      // Data default
      setLogPeminjaman([
        { id: 'TRX001', nama: 'Andi Pratama', buku: 'Laskar Pelangi', tglPinjam: '15/06/2026', tglKembali: '22/06/2026', status: 'Dipinjam' },
        { id: 'TRX002', nama: 'Siti Aminah', buku: 'Bumi', tglPinjam: '14/06/2026', tglKembali: '21/06/2026', status: 'Dipinjam' },
        { id: 'TRX003', nama: 'Rudi Hermawan', buku: 'Ensiklopedi Sains', tglPinjam: '10/06/2026', tglKembali: '17/06/2026', status: 'Terlambat' },
      ]);
    }

    // Ambil data buku
    const savedBuku = localStorage.getItem('dataBuku');
    if (savedBuku) {
      setDataBuku(JSON.parse(savedBuku));
    } else {
      setDataBuku([
        { kode: 'B001', judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', kategori: 'Fiksi', stok: 5 },
        { kode: 'B002', judul: 'Bumi', pengarang: 'Tere Liye', kategori: 'Novel', stok: 3 },
        { kode: 'B003', judul: 'Matematika SD Kelas 4', pengarang: 'Tim Edukasi', kategori: 'Pelajaran', stok: 12 },
        { kode: 'B004', judul: 'Kamus Indonesia-Inggris', pengarang: 'Hassan Shadily', kategori: 'Referensi', stok: 8 },
        { kode: 'B005', judul: 'Ensiklopedi Sains', pengarang: 'Robert Winston', kategori: 'Sains', stok: 4 },
      ]);
    }

    // Ambil data anggota
    const savedAnggota = localStorage.getItem('dataAnggota');
    if (savedAnggota) {
      setDataAnggota(JSON.parse(savedAnggota));
    } else {
      setDataAnggota([
        { inisial: 'AP', nama: 'Andi Pratama', nis: '2024001', kelas: '5A', tipe: 'Siswa', terdaftar: '12/1/2024' },
        { inisial: 'SA', nama: 'Siti Aminah', nis: '2024002', kelas: '4B', tipe: 'Siswa', terdaftar: '15/1/2024' },
        { inisial: 'RH', nama: 'Rudi Hermawan', nis: '2024003', kelas: '6C', tipe: 'Siswa', terdaftar: '1/2/2024' },
      ]);
    }
  };

  // Hitung statistik berdasarkan data realtime
  const hitungStatistik = () => {
    // Total peminjaman (semua transaksi termasuk yang sudah dikembalikan)
    const semuaTransaksi = logPeminjaman;
    const totalPinjam = semuaTransaksi.length;
    
    // Peminjaman bulan ini
    const now = new Date();
    const bulanIni = now.getMonth();
    const tahunIni = now.getFullYear();
    const peminjamanBulanIni = semuaTransaksi.filter(item => {
      const [tgl, bln, thn] = item.tglPinjam.split('/');
      return parseInt(thn) === tahunIni && parseInt(bln) - 1 === bulanIni;
    }).length;

    // Hitung buku terpopuler
    const bukuCount = {};
    semuaTransaksi.forEach(item => {
      bukuCount[item.buku] = (bukuCount[item.buku] || 0) + 1;
    });
    const bukuTerpopuler = Object.entries(bukuCount)
      .map(([judul, jumlah]) => ({ judul, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 5);

    setStatistik({
      totalPeminjaman: totalPinjam,
      bukuTerpopuler: bukuTerpopuler,
      totalAnggota: dataAnggota.length,
      peminjamanBulanIni: peminjamanBulanIni
    });
  };

  // Load data saat komponen mount
  useEffect(() => {
    loadData();
  }, []);

  // Update statistik setiap ada perubahan data
  useEffect(() => {
    hitungStatistik();
  }, [logPeminjaman, dataAnggota]);

  // Dengarkan perubahan storage dari halaman lain
  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Filter data peminjaman untuk ditampilkan
  const filteredPeminjaman = logPeminjaman.filter(item => {
    let matchesSearch = true;
    let matchesDate = true;

    if (searchQuery) {
      matchesSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.buku.toLowerCase().includes(searchQuery.toLowerCase());
    }

    if (filterStartDate && filterEndDate) {
      const [tgl, bln, thn] = item.tglPinjam.split('/');
      const itemDate = new Date(`${thn}-${bln}-${tgl}`);
      const startDate = new Date(filterStartDate);
      const endDate = new Date(filterEndDate);
      matchesDate = itemDate >= startDate && itemDate <= endDate;
    }

    return matchesSearch && matchesDate;
  });

  // Fungsi untuk Generate PDF (Versi Manual)
  const generatePDF = () => {
    try {
      const dataToPrint = filteredPeminjaman;

      if (dataToPrint.length === 0) {
        alert('Tidak ada data untuk dicetak!');
        return;
      }

      const doc = new jsPDF();
      let yPosition = 20;
      
      // Header PDF
      doc.setFontSize(18);
      doc.text('LAPORAN PEMINJAMAN BUKU', 14, yPosition);
      yPosition += 8;
      
      doc.setFontSize(11);
      doc.text('Perpustakaan SD Negeri 1 Semiring', 14, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      doc.text(`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID')}`, 14, yPosition);
      yPosition += 6;
      doc.text(`Waktu Cetak: ${new Date().toLocaleTimeString('id-ID')}`, 14, yPosition);
      yPosition += 6;
      
      if (filterStartDate && filterEndDate) {
        doc.text(`Periode: ${filterStartDate} s/d ${filterEndDate}`, 14, yPosition);
        yPosition += 8;
      } else {
        yPosition += 2;
      }
      
      // Header Tabel
      const headers = ['No', 'Peminjam', 'Buku', 'Tgl Pinjam', 'Tgl Kembali', 'Status'];
      const colWidths = [15, 40, 50, 30, 30, 25];
      
      // Gambar header dengan warna biru
      doc.setFillColor(37, 99, 235);
      doc.rect(14, yPosition, 182, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      
      let xPos = 14;
      headers.forEach((header, i) => {
        doc.text(header, xPos + 2, yPosition + 5);
        xPos += colWidths[i];
      });
      
      // Data tabel
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      let currentY = yPosition + 10;
      
      dataToPrint.forEach((item, index) => {
        // Cek apakah perlu halaman baru
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
          
          // Gambar ulang header di halaman baru
          doc.setFillColor(37, 99, 235);
          doc.rect(14, currentY, 182, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          
          xPos = 14;
          headers.forEach((header, i) => {
            doc.text(header, xPos + 2, currentY + 5);
            xPos += colWidths[i];
          });
          
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
          currentY += 10;
        }
        
        // Warna baris bergantian
        if (index % 2 === 0) {
          doc.setFillColor(241, 245, 249);
          doc.rect(14, currentY - 4, 182, 8, 'F');
        }
        
        const rowData = [
          (index + 1).toString(),
          item.nama,
          item.buku,
          item.tglPinjam,
          item.tglKembali,
          item.status
        ];
        
        xPos = 14;
        rowData.forEach((data, i) => {
          doc.text(data, xPos + 2, currentY);
          xPos += colWidths[i];
        });
        
        currentY += 8;
      });
      
      // Ringkasan
      const finalY = currentY + 10;
      doc.setFontSize(10);
      doc.text(`Total Transaksi: ${dataToPrint.length} peminjaman`, 14, finalY);
      
      const selesai = dataToPrint.filter(item => item.status === 'Dikembalikan').length;
      const dipinjam = dataToPrint.filter(item => item.status === 'Dipinjam').length;
      const terlambat = dataToPrint.filter(item => item.status === 'Terlambat').length;
      
      doc.text(`Detail Status: ${selesai} Selesai | ${dipinjam} Dipinjam | ${terlambat} Terlambat`, 14, finalY + 7);
      doc.text(`Total Anggota Terdaftar: ${dataAnggota.length} orang`, 14, finalY + 14);
      doc.setFontSize(8);
      doc.text('* Laporan ini dibuat secara otomatis oleh sistem', 14, finalY + 21);
      
      // Simpan PDF
      const fileName = `Laporan_Peminjaman_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.pdf`;
      doc.save(fileName);
      
      alert('✓ PDF berhasil didownload! Cek folder Downloads Anda.');
      
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan: " + error.message);
    }
  };

  // Fungsi Cetak (Print)
  const handlePrint = () => {
    window.print();
  };

  // Data untuk grafik (6 bulan terakhir)
  const getLast6MonthsData = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('id-ID', { month: 'short' });
      const year = date.getFullYear();
      const count = logPeminjaman.filter(item => {
        const [tgl, bln, thn] = item.tglPinjam.split('/');
        return parseInt(thn) === year && parseInt(bln) - 1 === date.getMonth();
      }).length;
      months.push({ name: monthName, count: count, height: Math.min(count * 5, 170) });
    }
    return months;
  };

  const monthlyData = getLast6MonthsData();

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden text-slate-800">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between">
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
            <button onClick={() => onNavigate('pengembalian')} className="flex w-full items-center gap-3 text-slate-500 hover:bg-slate-50 px-4 py-3 rounded-xl font-medium text-left transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="17" y1="7" x2="7" y2="17"></line><polyline points="17 17 7 17 7 7"></polyline></svg>
              Pengembalian
            </button>
            <button onClick={() => onNavigate('laporan')} className="flex w-full items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium text-left">
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
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-blue-600">Laporan & Statistik</h2>
              <p className="text-slate-500 text-sm mt-1">Rekapitulasi penggunaan fasilitas perpustakaan (Data Realtime)</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrint}
                className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                Cetak
              </button>
              <button 
                onClick={generatePDF}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Download PDF
              </button>
            </div>
          </div>

          {/* Filter Periode dan Pencarian */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-8">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Filter Laporan</h3>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-slate-500 block mb-1">Cari Nama/Buku</label>
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ketik nama atau judul buku..." 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Dari Tanggal</label>
                <input 
                  type="date" 
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-slate-500 block mb-1">Sampai Tanggal</label>
                <input 
                  type="date" 
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={() => {
                    setFilterStartDate('');
                    setFilterEndDate('');
                    setSearchQuery('');
                  }}
                  className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            
            {/* Kartu Kiri: Grafik Tren Peminjaman */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                <h3 className="text-lg font-bold text-slate-800">Tren Peminjaman</h3>
              </div>
              <p className="text-sm text-slate-500 mb-8">Jumlah peminjaman buku 6 bulan terakhir (Data Realtime)</p>
              
              <div className="relative h-48 w-full border-b border-slate-200 flex items-end justify-around pb-2">
                {monthlyData.map((month, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2">
                    <div 
                      className="w-8 bg-blue-600 rounded-t-sm transition-all duration-300" 
                      style={{ height: `${month.height}px` }}
                    ></div>
                    <span className="text-[10px] text-slate-500">{month.name}</span>
                    <span className="text-[9px] text-blue-600 font-bold">{month.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Kartu Kanan: Ringkasan */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-blue-500"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <h3 className="text-lg font-bold text-slate-800">Ringkasan</h3>
              </div>
              <p className="text-sm text-slate-500 mb-6">Statistik peminjaman realtime</p>

              <div className="flex gap-4 mb-6">
                <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-[10px] font-bold tracking-wider text-slate-500 mb-1">TOTAL PEMINJAMAN</p>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{statistik.totalPeminjaman}</p>
                  <p className="text-[10px] font-semibold text-emerald-500">Semua transaksi</p>
                </div>
                <div className="flex-1 bg-[#fcfeed] border border-[#f4f7ca] rounded-xl p-4">
                  <p className="text-[10px] font-bold tracking-wider text-slate-600 mb-1">ANGGOTA</p>
                  <p className="text-2xl font-bold text-slate-800 mb-1">{statistik.totalAnggota}</p>
                  <p className="text-[10px] font-semibold text-emerald-600">Terdaftar</p>
                </div>
              </div>

              <div className="mt-auto">
                <h4 className="text-sm font-bold text-slate-800 mb-3">Buku Terpopuler</h4>
                <div className="flex flex-col gap-3">
                  {statistik.bukuTerpopuler.length > 0 ? (
                    statistik.bukuTerpopuler.map((buku, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <p className="text-sm text-slate-600 truncate flex-1">{buku.judul}</p>
                        <p className="text-sm font-semibold text-blue-600">{buku.jumlah} kali</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">Belum ada data peminjaman</p>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Tabel Log Peminjaman */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-800">Log Peminjaman</h3>
            <p className="text-slate-500 text-sm">Menampilkan {filteredPeminjaman.length} dari {logPeminjaman.length} transaksi</p>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-800 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold">No</th>
                    <th className="px-6 py-4 font-bold">Peminjam</th>
                    <th className="px-6 py-4 font-bold">Buku</th>
                    <th className="px-6 py-4 font-bold">Tgl Pinjam</th>
                    <th className="px-6 py-4 font-bold">Tgl Kembali</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPeminjaman.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-slate-600">{index + 1}</td>
                      <td className="px-6 py-4 text-slate-600">{item.nama}</td>
                      <td className="px-6 py-4 text-slate-600">{item.buku}</td>
                      <td className="px-6 py-4 text-slate-600">{item.tglPinjam}</td>
                      <td className="px-6 py-4 text-slate-600">{item.tglKembali}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-md text-[10px] font-bold ${
                          item.status === 'Dikembalikan' 
                            ? 'bg-[#e5fcf1] text-[#1aa05f] border border-[#b2eacb]' 
                            : item.status === 'Dipinjam'
                            ? 'bg-[#fff3e0] text-[#f59e0b] border border-[#fed7aa]'
                            : 'bg-[#fee2e2] text-[#dc2626] border border-[#fecaca]'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredPeminjaman.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-400">
                        {logPeminjaman.length === 0 ? 'Belum ada data peminjaman' : 'Tidak ada data yang sesuai filter'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}