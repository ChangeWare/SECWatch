from sec_miner.persistence.concept_types import ConceptType


def convert_enums_to_strings(data):
    """Recursively convert ConceptType enums to strings in a dictionary."""
    if isinstance(data, dict):
        return {key: convert_enums_to_strings(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_enums_to_strings(item) for item in data]
    elif isinstance(data, ConceptType):
        return str(data)  # Convert ConceptType enum to string
    else:
        return data