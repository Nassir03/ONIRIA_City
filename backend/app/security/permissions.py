ROLE_PERMISSIONS = {
    "administrator": {
        "admin:dashboard",
        "leads:view_all",
        "leads:assign",
        "leads:update",
        "staff:manage",
        "campaigns:view",
        "conversations:view",
    },
    "sales_manager": {
        "admin:dashboard",
        "leads:view_all",
        "leads:assign",
        "leads:update",
        "campaigns:view",
        "conversations:view",
    },
    "sales_agent": {
        "admin:dashboard",
        "leads:view_assigned",
        "leads:update",
        "conversations:view",
    },
    "marketing_staff": {
        "admin:dashboard",
        "campaigns:view",
        "leads:view_summary",
    },
    "knowledge_editor": {
        "admin:dashboard",
        "conversations:view",
    },
}


def has_permission(roles: list[str], permission: str) -> bool:
    return any(permission in ROLE_PERMISSIONS.get(role, set()) for role in roles)
