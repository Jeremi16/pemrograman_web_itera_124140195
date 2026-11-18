from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config

from ..models import Mahasiswa
from . import get_id, get_json_body

REQUIRED_FIELDS = ('nim', 'nama', 'jurusan')
ALLOWED_FIELDS = REQUIRED_FIELDS + ('alamat',)


def _get_or_404(request):
    mhs = request.dbsession.get(Mahasiswa, get_id(request))
    if mhs is None:
        raise HTTPNotFound(json={'error': 'Mahasiswa tidak ditemukan'})
    return mhs


def _check_unique(request, value, current_id=None):
    """Tolak (400) jika nim sudah dipakai data lain."""
    query = request.dbsession.query(Mahasiswa).filter_by(nim=value)
    if current_id is not None:
        query = query.filter(Mahasiswa.id != current_id)
    if query.first() is not None:
        raise HTTPBadRequest(json={'error': 'NIM sudah digunakan'})


@view_config(route_name='mahasiswa_list', renderer='json')
def mahasiswa_list(request):
    rows = request.dbsession.query(Mahasiswa).order_by(Mahasiswa.id).all()
    return {'mahasiswa': [m.to_dict() for m in rows]}


@view_config(route_name='mahasiswa_detail', renderer='json')
def mahasiswa_detail(request):
    return {'mahasiswa': _get_or_404(request).to_dict()}


@view_config(route_name='mahasiswa_add', renderer='json')
def mahasiswa_add(request):
    data = get_json_body(request)
    missing = [f for f in REQUIRED_FIELDS if not data.get(f)]
    if missing:
        raise HTTPBadRequest(json={'error': 'Field wajib belum diisi',
                                   'missing_fields': missing})
    _check_unique(request, data['nim'])
    mhs = Mahasiswa(**{k: data[k] for k in ALLOWED_FIELDS if k in data})
    request.dbsession.add(mhs)
    request.dbsession.flush()
    request.response.status = 201
    return {'success': True, 'mahasiswa': mhs.to_dict()}


@view_config(route_name='mahasiswa_update', renderer='json')
def mahasiswa_update(request):
    mhs = _get_or_404(request)
    data = get_json_body(request)
    if 'nim' in data:
        _check_unique(request, data['nim'], current_id=mhs.id)
    for key in ALLOWED_FIELDS:
        if key in data:
            setattr(mhs, key, data[key])
    request.dbsession.flush()
    return {'success': True, 'mahasiswa': mhs.to_dict()}


@view_config(route_name='mahasiswa_delete', renderer='json')
def mahasiswa_delete(request):
    mhs = _get_or_404(request)
    request.dbsession.delete(mhs)
    return {'success': True,
            'message': f'Mahasiswa dengan id {mhs.id} berhasil dihapus'}
