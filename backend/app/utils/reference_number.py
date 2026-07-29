from datetime import datetime, timezone


def make_reference_number(sequence: int) -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"ON-{today}-{sequence:05d}"


def make_account_recovery_reference(sequence: int) -> str:
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    return f"AR-{today}-{sequence:05d}"
