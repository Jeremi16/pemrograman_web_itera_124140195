"""
library_item.py
Berisi abstract class LibraryItem beserta subclass Book dan Magazine.
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """
    Abstract base class untuk semua item di perpustakaan.
    Tidak bisa diinstansiasi langsung; subclass wajib mengimplementasikan
    method abstract get_detail(), hitung_denda(), dan property jenis.
    """

    def __init__(self, item_id, judul, tahun):
        # Atribut protected: boleh diakses subclass, bukan dari luar
        self._id = item_id
        self._judul = judul
        self._tahun = tahun
        # Atribut private: status peminjaman hanya diubah lewat method
        self.__dipinjam = False

    # ---------- Property (getter read-only) ----------
    @property
    def item_id(self):
        """ID unik item (read-only)."""
        return self._id

    @property
    def judul(self):
        """Judul item (read-only)."""
        return self._judul

    @property
    def tahun(self):
        """Tahun terbit item (read-only)."""
        return self._tahun

    @property
    def is_dipinjam(self):
        """Status apakah item sedang dipinjam (read-only dari luar)."""
        return self.__dipinjam

    # ---------- Method pengubah status ----------
    def pinjam(self):
        """Tandai item sebagai dipinjam. Return True jika berhasil."""
        if self.__dipinjam:
            return False
        self.__dipinjam = True
        return True

    def kembalikan(self):
        """Tandai item sebagai sudah dikembalikan. Return True jika berhasil."""
        if not self.__dipinjam:
            return False
        self.__dipinjam = False
        return True

    def status_text(self):
        """Teks status ketersediaan item."""
        return "Dipinjam" if self.__dipinjam else "Tersedia"

    # ---------- Method abstract ----------
    @property
    @abstractmethod
    def jenis(self):
        """Nama jenis item (misal 'Buku' atau 'Majalah')."""

    @abstractmethod
    def get_detail(self):
        """Kembalikan string detail item sesuai jenisnya."""

    @abstractmethod
    def hitung_denda(self, hari_terlambat):
        """Hitung denda keterlambatan berdasarkan jumlah hari."""

    def __str__(self):
        # Polymorphism: get_detail() yang dipanggil tergantung subclass
        return self.get_detail()


class Book(LibraryItem):
    """Representasi buku. Denda Rp1.000 per hari keterlambatan."""

    DENDA_PER_HARI = 1000

    def __init__(self, item_id, judul, tahun, penulis, isbn, halaman):
        super().__init__(item_id, judul, tahun)
        self._penulis = penulis
        self.__isbn = isbn          # private
        self.halaman = halaman      # lewat setter (validasi)

    @property
    def jenis(self):
        return "Buku"

    @property
    def isbn(self):
        """ISBN buku (read-only)."""
        return self.__isbn

    @property
    def halaman(self):
        """Jumlah halaman buku."""
        return self._halaman

    @halaman.setter
    def halaman(self, nilai):
        """Setter dengan validasi: halaman harus bilangan bulat positif."""
        if not isinstance(nilai, int) or nilai <= 0:
            raise ValueError("Jumlah halaman harus bilangan bulat > 0")
        self._halaman = nilai

    def get_detail(self):
        return (f"[{self._id}] {self.jenis:<8} | {self._judul} ({self._tahun}) "
                f"- {self._penulis}, {self._halaman} hlm | {self.status_text()}")

    def hitung_denda(self, hari_terlambat):
        return max(0, hari_terlambat) * self.DENDA_PER_HARI


class Magazine(LibraryItem):
    """Representasi majalah. Denda Rp500 per hari keterlambatan."""

    DENDA_PER_HARI = 500

    def __init__(self, item_id, judul, tahun, edisi, penerbit):
        super().__init__(item_id, judul, tahun)
        self._edisi = edisi
        self._penerbit = penerbit

    @property
    def jenis(self):
        return "Majalah"

    def get_detail(self):
        return (f"[{self._id}] {self.jenis:<8} | {self._judul} ({self._tahun}) "
                f"- Edisi {self._edisi}, {self._penerbit} | {self.status_text()}")

    def hitung_denda(self, hari_terlambat):
        return max(0, hari_terlambat) * self.DENDA_PER_HARI
