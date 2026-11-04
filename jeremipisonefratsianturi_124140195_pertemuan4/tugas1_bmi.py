"""Tugas 1: Program penghitung BMI (Body Mass Index) sederhana."""


def input_angka_positif(pesan):
    """Meminta input angka positif dari pengguna sampai valid.

    Args:
        pesan (str): Teks prompt yang ditampilkan ke pengguna.

    Returns:
        float: Angka positif yang dimasukkan pengguna.
    """
    while True:
        try:
            nilai = float(input(pesan).replace(",", "."))
            if nilai > 0:
                return nilai
            print("Nilai harus lebih dari 0.")
        except ValueError:
            print("Input tidak valid, masukkan angka.")


def hitung_bmi(berat, tinggi):
    """Menghitung nilai BMI.

    Args:
        berat (float): Berat badan dalam kilogram.
        tinggi (float): Tinggi badan dalam meter.

    Returns:
        float: Nilai BMI = berat / (tinggi * tinggi).
    """
    return berat / (tinggi * tinggi)


def kategori_bmi(bmi):
    """Menentukan kategori berat badan berdasarkan nilai BMI.

    Args:
        bmi (float): Nilai BMI.

    Returns:
        str: Kategori status berat badan.
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif bmi < 25:
        return "Berat badan normal"
    elif bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    """Menjalankan program penghitung BMI.

    Returns:
        None
    """
    print("=" * 40)
    print("      PROGRAM PENGHITUNG BMI")
    print("=" * 40)
    berat = input_angka_positif("Masukkan berat badan (kg): ")
    tinggi = input_angka_positif("Masukkan tinggi badan (m) : ")

    bmi = hitung_bmi(berat, tinggi)
    kategori = kategori_bmi(bmi)

    print("-" * 40)
    print(f"Berat badan : {berat:.2f} kg")
    print(f"Tinggi badan: {tinggi:.2f} m")
    print(f"Nilai BMI   : {bmi:.2f}")
    print(f"Kategori    : {kategori}")
    print("=" * 40)


if __name__ == "__main__":
    main()
