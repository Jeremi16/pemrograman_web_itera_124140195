from pyramid.view import notfound_view_config


@notfound_view_config(renderer='json')
def notfound_view(context, request):
    # 404 yang dilempar dari view (mis. data tidak ditemukan) sudah
    # membawa body JSON sendiri, jadi dikembalikan apa adanya.
    if request.matched_route is not None:
        return context
    request.response.status = 404
    return {'error': 'Endpoint tidak ditemukan'}
