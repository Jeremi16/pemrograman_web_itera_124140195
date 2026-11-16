"""
library.py
Berisi class Library untuk menyimpan dan mengelola koleksi item perpustakaan.
"""

from library_item import LibraryItem


class Library:
    """
    Mengelola koleksi LibraryItem. Koleksi disimpan di atribut private
    __koleksi (dict id -> item) sehingga hanya bisa diubah lewat method.
    """

    def __init__(self, nama):
        self.__nama = nama
        self.__koleksi = {}

    @property
    def nama(self):
        """Nama perpustakaan (read-only)."""
        return self.__nama

    @property
    def jumlah_item(self):
        """Jumlah total item di koleksi."""
        return len(self.__koleksi)

    def tambah_item(self, item):
        """
        Tambah item ke koleksi. Menolak objek yang bukan LibraryItem
        dan ID yang sudah terdaftar. Return True jika berhasil.
        """
        if not isinstance(item, LibraryItem):
            print("  [GAGAL] Objek bukan LibraryItem.")
            return False
        if item.item_id in self.__koleksi:
            print(f"  [GAGAL] ID '{item.item_id}' sudah terdaftar.")
            return False
        self.__koleksi[item.item_id] = item
        print(f"  [OK] {item.jenis} '{item.judul}' ditambahkan.")
        return True

    def tampilkan_katalog(self, hanya_tersedia=False):
        """
        Tampilkan daftar item. Jika hanya_tersedia=True, item yang sedang
        dipinjam disembunyikan. get_detail() dipanggil secara polymorphic.
        """
        items = [i for i in self.__koleksi.values()
                 if not (hanya_tersedia and i.is_dipinjam)]
        judul = "Item Tersedia" if hanya_tersedia else "Semua Item"
        print(f"\n=== Katalog {self.__nama} - {judul} ({len(items)}) ===")
        if not items:
            print("  (kosong)")
        for item in items:
            print("  " + item.get_detail())

    def cari_by_id(self, item_id):
        """Cari item berdasarkan ID. Return item atau None."""
        return self.__koleksi.get(item_id)

    def cari_by_judul(self, kata_kunci):
        """Cari item yang judulnya mengandung kata kunci (case-insensitive)."""
        kunci = kata_kunci.lower()
        return [i for i in self.__koleksi.values() if kunci in i.judul.lower()]

    def pinjam_item(self, item_id):
        """Pinjam item berdasarkan ID. Return True jika berhasil."""
        item = self.cari_by_id(item_id)
        if item is None:
            print(f"  [GAGAL] Item '{item_id}' tidak ditemukan.")
            return False
        if not item.pinjam():
            print(f"  [GAGAL] '{item.judul}' sedang dipinjam.")
            return False
        print(f"  [OK] '{item.judul}' berhasil dipinjam.")
        return True

    def kembalikan_item(self, item_id):
        """Kembalikan item berdasarkan ID. Return True jika berhasil."""
        item = self.cari_by_id(item_id)
        if item is None or not item.kembalikan():
            print(f"  [GAGAL] Item '{item_id}' tidak bisa dikembalikan.")
            return False
        print(f"  [OK] '{item.judul}' berhasil dikembalikan.")
        return True
