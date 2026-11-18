from pyramid.httpexceptions import HTTPBadRequest, HTTPNotFound
from pyramid.view import view_config

from ..models import Matakuliah
from . import get_id, get_json_body

REQUIRED_FIELDS = ('kode_mk', 'nama_mk', 'sks', 'semester')


def _validate(data, partial=False):
    """Validasi & normalisasi field matakuliah.

    partial=True dipakai untuk PUT (field boleh sebagian).
    """
    if not partial:
        missing = [f for f in REQUIRED_FIELDS
                   if data.get(f) in (None, '')]
        if missing:
            raise HTTPBadRequest(json={
                'error': 'Field wajib belum diisi',
                'missing_fields': missing,
            })

    clean = {}
    for field in ('kode_mk', 'nama_mk'):
        if field in data:
            value = data[field]
            if not isinstance(value, str) or not value.strip():
                raise HTTPBadRequest(json={
                    'error': f'{field} harus berupa teks yang tidak kosong'})
            clean[field] = value.strip()

    for field in ('sks', 'semester'):
        if field in data:
            value = data[field]
            if isinstance(value, bool) or not isinstance(value, int):
                raise HTTPBadRequest(json={
                    'error': f'{field} harus berupa bilangan bulat'})
            if value <= 0:
                raise HTTPBadRequest(json={
                    'error': f'{field} harus lebih dari 0'})
            clean[field] = value

    if partial and not clean:
        raise HTTPBadRequest(json={
            'error': 'Tidak ada field yang diperbarui',
            'allowed_fields': list(REQUIRED_FIELDS),
        })
    return clean


def _get_or_404(request):
    mk = request.dbsession.get(Matakuliah, get_id(request))
    if mk is None:
        raise HTTPNotFound(json={'error': 'Matakuliah tidak ditemukan'})
    return mk


def _check_unique(request, value, current_id=None):
    """Tolak (400) jika kode_mk sudah dipakai data lain."""
    query = request.dbsession.query(Matakuliah).filter_by(kode_mk=value)
    if current_id is not None:
        query = query.filter(Matakuliah.id != current_id)
    if query.first() is not None:
        raise HTTPBadRequest(json={'error': 'kode_mk sudah digunakan'})


@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    """GET /api/matakuliah"""
    rows = request.dbsession.query(Matakuliah).order_by(Matakuliah.id).all()
    return {'matakuliah': [mk.to_dict() for mk in rows]}


@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    """GET /api/matakuliah/{id}"""
    return {'matakuliah': _get_or_404(request).to_dict()}


@view_config(route_name='matakuliah_add', renderer='json')
def matakuliah_add(request):
    """POST /api/matakuliah"""
    data = _validate(get_json_body(request))
    _check_unique(request, data['kode_mk'])
    mk = Matakuliah(**data)
    request.dbsession.add(mk)
    request.dbsession.flush()
    request.response.status = 201
    return {'success': True, 'matakuliah': mk.to_dict()}


@view_config(route_name='matakuliah_update', renderer='json')
def matakuliah_update(request):
    """PUT /api/matakuliah/{id}"""
    mk = _get_or_404(request)
    data = _validate(get_json_body(request), partial=True)
    if 'kode_mk' in data:
        _check_unique(request, data['kode_mk'], current_id=mk.id)
    for key, value in data.items():
        setattr(mk, key, value)
    request.dbsession.flush()
    return {'success': True, 'matakuliah': mk.to_dict()}


@view_config(route_name='matakuliah_delete', renderer='json')
def matakuliah_delete(request):
    """DELETE /api/matakuliah/{id}"""
    mk = _get_or_404(request)
    request.dbsession.delete(mk)
    return {'success': True,
            'message': f'Matakuliah dengan id {mk.id} berhasil dihapus'}
