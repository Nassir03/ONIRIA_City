from datetime import UTC, datetime


def make_reference_number(sequence: int) -> str:
    today = datetime.now(UTC).strftime("%Y%m%d")
    return f"ON-{today}-{sequence:05d}"
