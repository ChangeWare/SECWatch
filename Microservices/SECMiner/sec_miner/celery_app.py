from celery import Celery
from config.loader import config


def create_celery_app():
    app = Celery(
        'sec_miner',
        include=[
            'sec_miner.tasks.company',
            'sec_miner.tasks.maintenance',
            'sec_miner.tasks.filing',
            'sec_miner.tasks.monitoring'
        ]
    )
    app.config_from_object(config)
    return app


celery_app = create_celery_app()


@celery_app.on_after_configure.connect
def setup_task_registry(sender, **kwargs):
    print("Registered tasks:", sender.tasks.keys())
