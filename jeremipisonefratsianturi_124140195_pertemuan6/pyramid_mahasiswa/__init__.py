from pyramid.config import Configurator


def main(global_config, **settings):
    """Membuat dan mengembalikan aplikasi WSGI Pyramid."""
    with Configurator(settings=settings) as config:
        config.include('pyramid_tm')
        config.include('pyramid_retry')
        config.include('.models')
        config.include('.routes')
        config.scan()
    return config.make_wsgi_app()
