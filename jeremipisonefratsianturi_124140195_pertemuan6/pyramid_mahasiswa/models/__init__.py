import zope.sqlalchemy
from sqlalchemy import engine_from_config
from sqlalchemy.orm import configure_mappers, sessionmaker

# Import semua model agar terdaftar pada metadata (dibutuhkan Alembic).
from .mahasiswa import Mahasiswa  # noqa: F401
from .matakuliah import Matakuliah  # noqa: F401

configure_mappers()


def get_engine(settings, prefix='sqlalchemy.'):
    return engine_from_config(settings, prefix)


def get_session_factory(engine):
    factory = sessionmaker()
    factory.configure(bind=engine)
    return factory


def get_tm_session(session_factory, transaction_manager, request=None):
    dbsession = session_factory(info={'request': request})
    zope.sqlalchemy.register(
        dbsession, transaction_manager=transaction_manager)
    return dbsession


def includeme(config):
    settings = config.get_settings()
    settings['tm.manager_hook'] = 'pyramid_tm.explicit_manager'

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)
    config.registry['dbsession_factory'] = session_factory

    def dbsession(request):
        dbsession = request.environ.get('app.dbsession')
        if dbsession is None:
            dbsession = get_tm_session(
                session_factory, request.tm, request=request)
        return dbsession

    config.add_request_method(dbsession, reify=True)
