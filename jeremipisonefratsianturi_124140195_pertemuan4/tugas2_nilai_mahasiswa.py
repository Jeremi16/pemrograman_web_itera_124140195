"""Tugas 2: Program pengelolaan data nilai mahasiswa."""

data_mahasiswa = [
    {"nama": "Andi Pratama", "nim": "124140101",
     "nilai_uts": 85, "nilai_uas": 90, "nilai_tugas": 88},
    {"nama": "Budi Santoso", "nim": "124140102",
     "nilai_uts": 70, "nilai_uas": 75, "nilai_tugas": 80},
    {"nama": "Citra Lestari", "nim": "124140103",
     "nilai_uts": 60, "nilai_uas": 65, "nilai_tugas": 70},
    {"nama": "Dewi Anggraini", "nim": "124140104",
     "nilai_uts": 55, "nilai_uas": 50, "nilai_tugas": 60},
    {"nama": "Eko Saputra", "nim": "124140105",
     "nilai_uts": 40, "nilai_uas": 45, "nilai_tugas": 50},
    {"nama": "Fajar Nugroho", "nim": "124140106",
     "nilai_uts": 78, "nilai_uas": 82, "nilai_tugas": 75},
]


def hitung_nilai_akhir(mahasiswa):
    """Menghitung nilai akhir dengan bobot 30% UTS, 40% UAS, 30% Tugas.

    Args:
        mahasiswa (dict): Data mahasiswa berisi nilai_uts, nilai_uas,
            dan nilai_tugas.

    Returns:
        float: Nilai akhir mahasiswa.
    """
    return (0.3 * mahasiswa["nilai_uts"]
            + 0.4 * mahasiswa["nilai_uas"]
            + 0.3 * mahasiswa["nilai_tugas"])


def tentukan_grade(nilai_akhir):
    """Menentukan grade berdasarkan nilai akhir.

    Args:
        nilai_akhir (float): Nilai akhir mahasiswa.

    Returns:
        str: Grade "A", "B", "C", "D", atau "E".
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def proses_data(daftar_mahasiswa):
    """Menambahkan kunci nilai_akhir dan grade ke setiap dictionary.

    Args:
        daftar_mahasiswa (list[dict]): List data mahasiswa.

    Returns:
        list[dict]: List yang sama dengan kunci nilai_akhir dan grade.
    """
    for mahasiswa in daftar_mahasiswa:
        mahasiswa["nilai_akhir"] = hitung_nilai_akhir(mahasiswa)
        mahasiswa["grade"] = tentukan_grade(mahasiswa["nilai_akhir"])
    return daftar_mahasiswa


def tampilkan_tabel(daftar_mahasiswa):
    """Mencetak data mahasiswa dalam format tabel.

    Args:
        daftar_mahasiswa (list[dict]): List data mahasiswa yang sudah
            diproses.

    Returns:
        None
    """
    garis = "+-----+-----------------+-----------+-------------+-------+"
    print(garis)
    print(f"| {'No':<3} | {'Nama':<15} | {'NIM':<9} "
          f"| {'Nilai Akhir':>11} | {'Grade':^5} |")
    print(garis)
    for i, mhs in enumerate(daftar_mahasiswa, start=1):
        print(f"| {i:<3} | {mhs['nama']:<15} | {mhs['nim']:<9} "
              f"| {mhs['nilai_akhir']:>11.2f} | {mhs['grade']:^5} |")
    print(garis)


def cari_tertinggi(daftar_mahasiswa):
    """Mencari mahasiswa dengan nilai akhir tertinggi.

    Args:
        daftar_mahasiswa (list[dict]): List data mahasiswa yang sudah
            diproses.

    Returns:
        dict: Data mahasiswa dengan nilai akhir tertinggi.
    """
    return max(daftar_mahasiswa, key=lambda mhs: mhs["nilai_akhir"])


def cari_terendah(daftar_mahasiswa):
    """Mencari mahasiswa dengan nilai akhir terendah.

    Args:
        daftar_mahasiswa (list[dict]): List data mahasiswa yang sudah
            diproses.

    Returns:
        dict: Data mahasiswa dengan nilai akhir terendah.
    """
    return min(daftar_mahasiswa, key=lambda mhs: mhs["nilai_akhir"])


def main():
    """Menjalankan program pengelolaan nilai mahasiswa.

    Returns:
        None
    """
    print("DATA NILAI MAHASISWA")
    proses_data(data_mahasiswa)
    tampilkan_tabel(data_mahasiswa)

    tertinggi = cari_tertinggi(data_mahasiswa)
    terendah = cari_terendah(data_mahasiswa)
    print(f"\nNilai tertinggi: {tertinggi['nama']} ({tertinggi['nim']}) "
          f"- {tertinggi['nilai_akhir']:.2f} [{tertinggi['grade']}]")
    print(f"Nilai terendah : {terendah['nama']} ({terendah['nim']}) "
          f"- {terendah['nilai_akhir']:.2f} [{terendah['grade']}]")


if __name__ == "__main__":
    main()
