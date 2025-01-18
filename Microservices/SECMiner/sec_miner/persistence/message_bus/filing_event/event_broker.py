from typing import List
from sec_miner.config.loader import config
from sec_miner.persistence.message_bus.filing_event.types import FilingEvent
import json
import pika


class FilingEventBroker:
    def __init__(self):
        self.connection = pika.BlockingConnection(
            pika.ConnectionParameters(host=config.RABBITMQ_HOST, port=config.RABBITMQ_PORT)
        )
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue='filing_event')

    def queue_filings_events(self, filing_events: List[FilingEvent]):
        data = json.dumps([event.to_json() for event in filing_events], default=str)
        self.channel.basic_publish(exchange='', routing_key='filing_event', body=data)
