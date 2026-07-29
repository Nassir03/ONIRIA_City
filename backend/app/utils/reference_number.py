from datetime import datetime, timezone


def make_reference_number(sequence: int) -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"ON-{today}-{sequence:05d}"
