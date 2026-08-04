import React from 'react';

export default function LoginPage({ onLogin }) {
  // Representasi SVG untuk ikon toga dengan garis yang lebih tebal
  const TogaIcon = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-12 h-12"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-100">
        
        {/* Bagian Atas (Header): Ikon dan Teks */}
        <div className="flex flex-col items-center mb-10">
          {/* Lingkaran Ikon Toga */}
          <div className="bg-slate-100 text-blue-600 rounded-full p-4 mb-4">
            {TogaIcon}
          </div>
          {/* Judul Utama */}
          <h1 className="text-3xl font-bold text-blue-600 tracking-tight text-center">
            SD Negeri 1 Semiring
          </h1>
          {/* Sub-judul */}
          <p className="text-sm text-slate-500 mt-2 text-center">
            Sistem Informasi Manajemen Perpustakaan
          </p>
        </div>

        {/* Bagian Tengah: Formulir */}
        <form 
          className="flex flex-col gap-8"
          onSubmit={(e) => { 
            e.preventDefault(); // Mencegah browser refresh saat tombol ditekan
            onLogin();          // Memanggil fungsi pindah halaman dari App.jsx
          }}
        >
          {/* Input Username */}
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="text-sm font-medium text-slate-700 ml-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Masukkan username"
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Input Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-slate-700 ml-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Masukkan password"
              className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-sm placeholder:text-slate-400"
            />
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors duration-200 shadow-md"
          >
            Login
          </button>
        </form>

        {/* Bagian Bawah (Footer) */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-400">
            © 2026 - Perpustakaan Digital Sekolah
          </p>
        </div>
      </div>
    </div>
  );
}