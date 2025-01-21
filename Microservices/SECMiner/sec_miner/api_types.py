from typing import List

from pydantic import BaseModel


class CIKsRequest(BaseModel):
    ciks: List[str] = None