from sqlalchemy import Column, Integer, Text

from .meta import Base


class Mahasiswa(Base):
    """Model ORM untuk tabel mahasiswa."""

    __tablename__ = 'mahasiswa'

    id = Column(Integer, primary_key=True, autoincrement=True)
    nim = Column(Text, unique=True, nullable=False)
    nama = Column(Text, nullable=False)
    jurusan = Column(Text, nullable=False)
    alamat = Column(Text)

    def to_dict(self):
        """Serialisasi objek menjadi dictionary (JSON-ready)."""
        return {
            'id': self.id,
            'nim': self.nim,
            'nama': self.nama,
            'jurusan': self.jurusan,
            'alamat': self.alamat,
        }
