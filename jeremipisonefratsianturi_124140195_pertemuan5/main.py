"""
main.py
Skrip untuk menguji seluruh fungsionalitas sistem perpustakaan.
"""

from library_item import LibraryItem, Book, Magazine
from library import Library


def garis(judul):
    """Cetak header bagian demo."""
    print("\n" + "=" * 70)
    print(judul)
    print("=" * 70)


def main():
    """Jalankan demo sistem perpustakaan."""
    perpus = Library("Perpustakaan ITERA")

    garis("1. MENAMBAHKAN ITEM")
    perpus.tambah_item(Book("B001", "Laskar Pelangi", 2005, "Andrea Hirata", "978-979-3062-79-2", 529))
    perpus.tambah_item(Book("B002", "Bumi Manusia", 1980, "Pramoedya A. Toer", "978-979-97312-3-4", 535))
    perpus.tambah_item(Book("B003", "Clean Code", 2008, "Robert C. Martin", "978-0-13-235088-4", 464))
    perpus.tambah_item(Magazine("M001", "National Geographic", 2024, 12, "NatGeo Society"))
    perpus.tambah_item(Magazine("M002", "Tempo", 2025, 45, "Tempo Media"))
    print("Mencoba menambah ID duplikat:")
    perpus.tambah_item(Magazine("B001", "Majalah Duplikat", 2025, 1, "X"))
    print(f"Total item: {perpus.jumlah_item}")

    garis("2. MENAMPILKAN KATALOG")
    perpus.tampilkan_katalog()

    garis("3. MENCARI ITEM")
    print("Cari ID 'M001':")
    hasil = perpus.cari_by_id("M001")
    print("  " + (hasil.get_detail() if hasil else "Tidak ditemukan"))
    print("Cari ID 'X999':")
    hasil = perpus.cari_by_id("X999")
    print("  " + (hasil.get_detail() if hasil else "Tidak ditemukan"))
    print("Cari judul mengandung 'an':")
    for item in perpus.cari_by_judul("an"):
        print("  " + item.get_detail())

    garis("4. STATUS KETERSEDIAAN (PEMINJAMAN)")
    perpus.pinjam_item("B001")
    perpus.pinjam_item("M002")
    perpus.pinjam_item("B001")  # sudah dipinjam -> gagal
    perpus.tampilkan_katalog(hanya_tersedia=True)
    perpus.kembalikan_item("B001")
    perpus.tampilkan_katalog(hanya_tersedia=True)

    garis("5. POLYMORPHISM - HITUNG DENDA (terlambat 3 hari)")
    for item_id in ("B002", "M001"):
        item = perpus.cari_by_id(item_id)
        print(f"  {item.jenis:<8} '{item.judul}': Rp{item.hitung_denda(3):,}")

    garis("6. ENCAPSULATION")
    buku = perpus.cari_by_id("B003")
    try:
        buku.is_dipinjam = True
    except AttributeError:
        print("  is_dipinjam tidak bisa di-set langsung (read-only property).")
    try:
        buku.halaman = -10
    except ValueError as e:
        print(f"  Setter halaman menolak nilai tidak valid: {e}")
    try:
        perpus.__koleksi
    except AttributeError:
        print("  Atribut private __koleksi tidak bisa diakses dari luar.")
    try:
        LibraryItem("X", "Abstrak", 2000)
    except TypeError:
        print("  LibraryItem adalah abstract class, tidak bisa diinstansiasi.")


if __name__ == "__main__":
    main()
