import sys
import redis
import pika
from typing import Dict, Any
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from sqlalchemy import create_engine
from sec_miner.config.loader import config


class ConnectionTester:
    def __init__(self):
        self.config = config
        self.results: Dict[str, Any] = {}

    def test_mssql(self) -> bool:
        try:
            connection_args = {
                "connect_timeout": 30,  # Give enough time for initial connection
                "timeout": 30,  # Command timeout
            }
            engine = create_engine(
                config.DATABASE_CONNECTION,
                pool_size=1,
                max_overflow=0,
                pool_timeout=30,
                connect_args=connection_args
            )
            connection = engine.connect()
            connection.close()
            print("✅ MSSQL connection successful")
            self.results['mssql'] = True
            return True
        except Exception as e:
            print(f"❌ MSSQL connection failed: {str(e)}")
            self.results['mssql'] = False
            return False


    def test_redis(self) -> bool:
        """Test Redis connection"""
        try:
            redis_client = redis.from_url(self.config.REDIS_URL)
            redis_client.ping()
            print("✅ Redis connection successful")
            self.results['redis'] = True
            return True
        except redis.ConnectionError as e:
            print(f"❌ Redis connection failed: {str(e)}")
            self.results['redis'] = False
            return False

    def test_rabbitmq(self) -> bool:
        """Test RabbitMQ connection"""
        try:
            credentials = pika.PlainCredentials(
                self.config.RABBITMQ_USER,
                self.config.RABBITMQ_PASS
            )
            parameters = pika.ConnectionParameters(
                host=self.config.RABBITMQ_HOST,
                port=int(self.config.RABBITMQ_PORT),
                credentials=credentials
            )
            connection = pika.BlockingConnection(parameters)
            connection.close()
            print("✅ RabbitMQ connection successful")
            self.results['rabbitmq'] = True
            return True
        except Exception as e:
            print(f"❌ RabbitMQ connection failed: {str(e)}")
            self.results['rabbitmq'] = False
            return False

    def test_mongodb(self) -> bool:
        """Test MongoDB connection"""
        try:
            client = MongoClient(self.config.MONGODB_CONNECTION)
            # The ismaster command is cheap and does not require auth
            client.admin.command('ismaster')
            print("✅ MongoDB connection successful")
            self.results['mongodb'] = True
            return True
        except ConnectionFailure as e:
            print(f"❌ MongoDB connection failed: {str(e)}")
            self.results['mongodb'] = False
            return False
        finally:
            client.close()

    def print_summary(self):
        """Print a summary of all connection tests"""
        print("\nConnection Test Summary:")
        print("------------------------")
        for service, status in self.results.items():
            status_symbol = "✅" if status else "❌"
            print(f"{status_symbol} {service.title()}: {'Connected' if status else 'Failed'}")


tester = ConnectionTester()

print("\nTesting connections...\n")

# Test all connections
redis_ok = tester.test_redis()
rabbitmq_ok = tester.test_rabbitmq()
mongodb_ok = tester.test_mongodb()
mssql_ok = tester.test_mssql()

tester.print_summary()

# Exit with appropriate status code
if all([redis_ok, rabbitmq_ok, mongodb_ok]):
    print("\n✅ All connections successful!")
    sys.exit(0)
else:
    print("\n❌ Some connections failed. Check the summary above.")
    sys.exit(1)
