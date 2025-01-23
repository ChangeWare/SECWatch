from celery import Celery
from celery.schedules import crontab
from sec_miner.config.loader import config
from kombu import Queue
from sec_miner.config.types import Schedule


def _convert_schedule_to_crontab(schedule: Schedule) -> crontab:
    """Convert schedule dictionary to crontab object with error handling"""
    schedule = crontab(
        minute=schedule.minute,
        hour=schedule.hour,
        day_of_week=schedule.day_of_week,
        day_of_month=schedule.day_of_month,
        month_of_year=schedule.month_of_year
    )
    return schedule


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

    task_queues = [
        Queue(queue_name) for queue_name in config.CELERY_QUEUE_CONFIG.keys()
    ]

    # Add the default celery queue
    task_queues.append(Queue('celery'))

    worker_pool_configs = {
        queue_name: queue_config.concurrency
        for queue_name, queue_config in config.CELERY_QUEUE_CONFIG.items()
    }

    app.config_from_object(config)

    beat_schedule = {}
    if config.BEAT_SCHEDULE:
        for task_name, task_config in config.BEAT_SCHEDULE.items():
            beat_schedule[task_name] = {
                'task': task_config['task'],
                'schedule': _convert_schedule_to_crontab(task_config['schedule'])
            }

    app.conf.update(
        task_queues=task_queues,
        worker_pool_configs=worker_pool_configs,
        beat_schedule=beat_schedule
    )

    app.conf.timezone = 'America/New_York'

    return app


celery_app = create_celery_app()


@celery_app.on_after_configure.connect
def setup_task_registry(sender, **kwargs):
    print("Registered tasks:", sender.tasks.keys())
