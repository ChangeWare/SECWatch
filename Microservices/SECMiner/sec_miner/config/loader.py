import json
import os
from pathlib import Path
from typing import Dict, Any

from celery.schedules import crontab

from types import ConfigModel


class ConfigurationError(Exception):
    pass


class ConfigLoader:
    _instance = None
    _config: ConfigModel = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if self._config is None:
            self.load_config()

    @staticmethod
    def _load_json_file(filepath: Path) -> Dict[str, Any]:
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            raise ConfigurationError(f"Configuration file not found: {filepath}")
        except json.JSONDecodeError:
            raise ConfigurationError(f"Invalid JSON in configuration file: {filepath}")

    def load_config(self):
        """Load configuration based on environment"""
        env = os.getenv('APP_ENV', 'development').lower()
        config_dir = Path(__file__).parent.parent / 'config'

        # Load base config
        base_config = self._load_json_file(config_dir / 'config.json')

        # Load environment-specific config
        env_config = self._load_json_file(config_dir / f'config.{env}.json')

        # Merge configurations
        merged_config = {**base_config, **env_config}

        # Convert schedule strings to crontab objects
        if 'BEAT_SCHEDULE' in merged_config:
            for task_name, task_config in merged_config['BEAT_SCHEDULE'].items():
                if isinstance(task_config['schedule'], dict):
                    schedule_args = task_config['schedule']
                    task_config['schedule'] = crontab(**schedule_args)

        # Validate configuration
        try:
            self._config = ConfigModel(**merged_config)
        except Exception as e:
            raise ConfigurationError(f"Invalid configuration: {str(e)}")

    @property
    def config(self) -> ConfigModel:
        return self._config


config = ConfigLoader().config
