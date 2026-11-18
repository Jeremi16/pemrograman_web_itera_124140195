from pyramid.httpexceptions import HTTPBadRequest


def get_json_body(request):
    """Ambil body JSON dari request, lempar 400 jika tidak valid."""
    try:
        body = request.json_body
    except ValueError:
        raise HTTPBadRequest(json={'error': 'Body harus berupa JSON valid'})
    if not isinstance(body, dict):
        raise HTTPBadRequest(json={'error': 'Body harus berupa objek JSON'})
    return body


def get_id(request):
    """Ambil parameter {id} dari URL sebagai integer."""
    try:
        return int(request.matchdict['id'])
    except ValueError:
        raise HTTPBadRequest(json={'error': 'ID harus berupa angka'})
