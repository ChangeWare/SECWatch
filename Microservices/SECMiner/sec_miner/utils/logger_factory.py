import logging
import argparse


def get_logger(name: str) -> logging.Logger:
    """
    Creates and configures a logger with a given name.
    Automatically determines debug mode based on command-line arguments.

    :param name: Name of the logger.
    :return: Configured logger instance.
    """
    logger = logging.getLogger(name)
    if not logger.hasHandlers():  # Avoid adding multiple handlers
        parser = argparse.ArgumentParser(add_help=False)
        parser.add_argument("--debug", action="store_true", help="Enable debug mode")
        args, _ = parser.parse_known_args()

        debug_mode = args.debug
        logger.setLevel(logging.DEBUG if debug_mode else logging.INFO)

        # Create console handler
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.DEBUG if debug_mode else logging.INFO)

        # Create formatter
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        console_handler.setFormatter(formatter)

        # Add the handler to the logger
        logger.addHandler(console_handler)

    return logger