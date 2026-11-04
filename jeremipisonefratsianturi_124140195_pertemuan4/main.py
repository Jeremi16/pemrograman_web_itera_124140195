"""Program utama yang menggunakan modul math_operations."""

# Cara impor 1: impor seluruh modul
import math_operations

# Cara impor 2: impor seluruh modul dengan alias
import math_operations as mo

# Cara impor 3: impor fungsi/konstanta tertentu
from math_operations import (
    PI,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
    keliling_lingkaran,
    luas_lingkaran,
)


def cetak_judul(judul):
    """Mencetak judul bagian dengan garis pembatas.

    Args:
        judul (str): Teks judul.

    Returns:
        None
    """
    print("\n" + "=" * 50)
    print(f" {judul}")
    print("=" * 50)


def main():
    """Menjalankan pengujian seluruh fungsi pada modul math_operations.

    Returns:
        None
    """
    print(f"Konstanta PI = {PI}")

    cetak_judul("PERSEGI")
    for sisi in [4, 7.5, 10]:
        luas = math_operations.luas_persegi(sisi)
        keliling = math_operations.keliling_persegi(sisi)
        print(f"Sisi {sisi:>5} -> Luas: {luas:>8.2f} | "
              f"Keliling: {keliling:>7.2f}")

    cetak_judul("PERSEGI PANJANG")
    for panjang, lebar in [(5, 3), (12, 4.5), (8, 8)]:
        luas = mo.luas_persegi_panjang(panjang, lebar)
        keliling = mo.keliling_persegi_panjang(panjang, lebar)
        print(f"P {panjang:>3} x L {lebar:>4} -> Luas: {luas:>8.2f} | "
              f"Keliling: {keliling:>7.2f}")

    cetak_judul("LINGKARAN")
    for jari_jari in [1, 7, 14]:
        luas = luas_lingkaran(jari_jari)
        keliling = keliling_lingkaran(jari_jari)
        print(f"r {jari_jari:>5} -> Luas: {luas:>8.2f} | "
              f"Keliling: {keliling:>7.2f}")

    cetak_judul("KONVERSI SUHU")
    print(f"{'Celsius':>10} | {'Fahrenheit':>10} | {'Kelvin':>10}")
    print("-" * 36)
    for celsius in [-40, 0, 37, 100]:
        print(f"{celsius:>10.2f} | {celsius_ke_fahrenheit(celsius):>10.2f} "
              f"| {celsius_ke_kelvin(celsius):>10.2f}")


if __name__ == "__main__":
    main()
