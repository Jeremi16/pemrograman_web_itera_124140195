import argparse
import sys

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError

from .. import models

MAHASISWA_SEED = [
    {'nim': '124140195', 'nama': 'Jeremi Pison Efrat Sianturi',
     'jurusan': 'Teknik Informatika', 'alamat': 'Lampung Selatan'},
    {'nim': '124140001', 'nama': 'Budi Santoso',
     'jurusan': 'Teknik Informatika', 'alamat': 'Bandar Lampung'},
]

MATAKULIAH_SEED = [
    {'kode_mk': 'IF2110', 'nama_mk': 'Algoritma dan Struktur Data',
     'sks': 3, 'semester': 3},
    {'kode_mk': 'IF3140', 'nama_mk': 'Basis Data', 'sks': 3,
     'semester': 5},
    {'kode_mk': 'IF3028', 'nama_mk': 'Pemrograman Web', 'sks': 4,
     'semester': 5},
    {'kode_mk': 'IF2240', 'nama_mk': 'Jaringan Komputer', 'sks': 3,
     'semester': 4},
]


def setup_models(dbsession):
    """Isi data awal (seeding), lewati data yang sudah ada."""
    for data in MAHASISWA_SEED:
        exists = dbsession.query(models.Mahasiswa).filter_by(
            nim=data['nim']).first()
        if not exists:
            dbsession.add(models.Mahasiswa(**data))

    for data in MATAKULIAH_SEED:
        exists = dbsession.query(models.Matakuliah).filter_by(
            kode_mk=data['kode_mk']).first()
        if not exists:
            dbsession.add(models.Matakuliah(**data))


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('config_uri', help='Configuration file, e.g., '
                                           'development.ini')
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            setup_models(env['request'].dbsession)
    except OperationalError:
        print('Gagal terhubung ke database. Pastikan PostgreSQL berjalan '
              'dan sqlalchemy.url di development.ini sudah benar, lalu '
              'jalankan "alembic -c development.ini upgrade head".')
    finally:
        env['closer']()
