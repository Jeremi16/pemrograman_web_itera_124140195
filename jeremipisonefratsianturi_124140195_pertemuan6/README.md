# RESTful API Manajemen Matakuliah (Pyramid + PostgreSQL)

## 1. Identitas

- **Nama Lengkap:** Jeremi Pison Efrat Sianturi
- **NIM:** 124140195
- **Kelas Praktikum:** RB

## 2. Deskripsi

Aplikasi web Pyramid `pyramid_mahasiswa` yang dikembangkan dengan modul baru
**Manajemen Data Matakuliah** berbasis PostgreSQL. Aplikasi menerapkan:

- **Model data ORM** (SQLAlchemy) — `Mahasiswa` dan `Matakuliah`
- **Migrasi database** dengan Alembic (autogenerate)
- **Routing URL Dispatch** dengan predikat `request_method`
- **View controller CRUD** yang mengembalikan JSON beserta status code yang tepat

### Struktur Berkas

```
jeremipisonefratsianturi_124140195_pertemuan6/
├── development.ini              # konfigurasi app, database, alembic, server
├── setup.py
├── screenshots/                 # bukti pengujian cURL
└── pyramid_mahasiswa/
    ├── __init__.py              # main(): Configurator
    ├── routes.py                # registrasi route + request_method
    ├── alembic/
    │   ├── env.py
    │   └── versions/
    │       ├── 20261118_c04af0146f29.py   # create mahasiswa table
    │       └── 20261118_c7947dfa2578.py   # create matakuliah table
    ├── models/
    │   ├── __init__.py          # registrasi model + session factory
    │   ├── meta.py              # Base & naming convention
    │   ├── mahasiswa.py
    │   └── matakuliah.py        # model Matakuliah + to_dict()
    ├── scripts/
    │   └── initialize_db.py     # seeding data awal
    └── views/
        ├── __init__.py          # helper (parsing JSON body & id)
        ├── mahasiswa.py
        ├── matakuliah.py        # CRUD matakuliah
        └── notfound.py          # 404 handler (JSON)
```

### Model `Matakuliah` (tabel `matakuliah`)

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | Integer | Primary Key, Autoincrement |
| `kode_mk` | Text | Unique, Not Null (contoh: IF2110) |
| `nama_mk` | Text | Not Null (contoh: Basis Data) |
| `sks` | Integer | Not Null, harus > 0 |
| `semester` | Integer | Not Null, harus > 0 |

Method `to_dict()` mengubah objek menjadi dictionary agar bisa dikirim sebagai JSON.

## 3. Endpoint API

| Method | URL | Keterangan | Status Code |
|---|---|---|---|
| GET | `/api/matakuliah` | Daftar seluruh mata kuliah | 200 |
| GET | `/api/matakuliah/{id}` | Detail mata kuliah | 200, 404 |
| POST | `/api/matakuliah` | Tambah mata kuliah baru | 201, 400 |
| PUT | `/api/matakuliah/{id}` | Perbarui mata kuliah (boleh sebagian field) | 200, 400, 404 |
| DELETE | `/api/matakuliah/{id}` | Hapus mata kuliah | 200, 404 |

Validasi yang diterapkan:

- POST wajib berisi `kode_mk`, `nama_mk`, `sks`, `semester` → jika kurang, **400** beserta daftar `missing_fields`.
- `sks` dan `semester` harus bilangan bulat **> 0** (nol, negatif, string, atau desimal ditolak dengan 400).
- `kode_mk` harus unik → duplikat ditolak dengan 400.
- Body yang bukan JSON valid → 400. ID yang tidak ada → 404.

## 4. Instalasi & Menjalankan

Prasyarat: Python 3.10+, PostgreSQL berjalan di `localhost:5432`.

1. Buat user dan database PostgreSQL (masuk sebagai superuser `postgres`):
   ```bash
   psql -U postgres
   ```
   ```sql
   CREATE USER pyramid_user WITH PASSWORD 'pyramid_pass';
   CREATE DATABASE pyramid_mahasiswa OWNER pyramid_user;
   ```

   Konfigurasi koneksi di `development.ini`:

   | Parameter | Nilai |
   |---|---|
   | Host | `localhost` |
   | Port | `5432` |
   | Database | `pyramid_mahasiswa` |
   | User | `pyramid_user` |
   | Password | `pyramid_pass` |

   ```ini
   sqlalchemy.url = postgresql+psycopg2://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
   ```
   Ubah baris tersebut jika user/password database Anda berbeda.

2. Buat virtual environment dan install project:
   ```bash
   python -m venv venv
   venv\Scripts\activate          # Linux/Mac: source venv/bin/activate
   pip install -e .
   ```

3. Jalankan migrasi Alembic:
   ```bash
   alembic -c development.ini upgrade head
   ```
   (Migrasi dibuat dengan `alembic -c development.ini revision --autogenerate -m "create matakuliah table"`.)

4. Isi data awal (seeding 4 mata kuliah + 2 mahasiswa):
   ```bash
   initialize_pyramid_mahasiswa_db development.ini
   ```

5. Jalankan server:
   ```bash
   pserve development.ini --reload
   ```
   Server berjalan di `http://localhost:6543`.

## 5. Contoh Pengujian cURL

```bash
curl http://localhost:6543/api/matakuliah
curl http://localhost:6543/api/matakuliah/1
curl -X POST http://localhost:6543/api/matakuliah -H "Content-Type: application/json" \
     -d '{"kode_mk":"IF3110","nama_mk":"Rekayasa Perangkat Lunak","sks":3,"semester":5}'
curl -X PUT http://localhost:6543/api/matakuliah/5 -H "Content-Type: application/json" \
     -d '{"nama_mk":"Rekayasa Perangkat Lunak Lanjut","sks":4}'
curl -X DELETE http://localhost:6543/api/matakuliah/5
```

## 6. Bukti Pengujian

### GET seluruh mata kuliah (200)
![GET all](screenshots/01-get-all.png)

### GET detail mata kuliah (200)
![GET detail](screenshots/02-get-detail.png)

### GET id tidak ditemukan (404)
![GET 404](screenshots/03-get-404.png)

### POST mata kuliah baru (201)
![POST 201](screenshots/04-post-201.png)

### POST field tidak lengkap (400)
![POST 400](screenshots/05-post-400.png)

### POST sks bernilai 0 (400)
![POST invalid](screenshots/06-post-400-invalid.png)

### POST kode_mk duplikat (400)
![POST duplikat](screenshots/07-post-400-duplikat.png)

### PUT perbarui mata kuliah (200)
![PUT 200](screenshots/08-put-200.png)

### PUT id tidak ditemukan (404)
![PUT 404](screenshots/09-put-404.png)

### DELETE mata kuliah (200)
![DELETE 200](screenshots/10-delete-200.png)

### DELETE id yang sudah dihapus (404)
![DELETE 404](screenshots/11-delete-404.png)
