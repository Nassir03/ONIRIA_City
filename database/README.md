\# ONIRIA City Database



PostgreSQL 17 migration files live in `database/migrations` and should be

applied in filename order.



\*\*Note:\*\* The implementation plan originally specified MySQL 8.0. This

project uses PostgreSQL 17 instead — confirmed with the team. Vector/semantic

search for ONIRIA AI is handled via a FAISS index built by the Python

backend; PostgreSQL stores each chunk's `faiss\_vector\_id` as a reference,

not the vectors themselves.



\## Local Setup



1\. Install PostgreSQL 17 and pgAdmin 4.

2\. In pgAdmin, create a new database named `oniria\_city`.

3\. Open a Query Tool on `oniria\_city` and run each file in

&#x20;  `database/migrations/` in filename order (001 through 010).

4\. Run `database/views/public\_properties.sql` to create the public read view.

5\. Seed data is not yet added — `database/seed/` is reserved for approved

&#x20;  ONIRIA content once available.

6\. See `database/docs/database-dictionary.md` for a full explanation of

&#x20;  every table and field.



Never commit real passwords or production credentials. Local Postgres

credentials (username/password) are set during PostgreSQL installation and

are not stored in this repository.



\## Migration Files



| File | Contents |

|---|---|

| 001\_extensions.sql | Setup notes (PostgreSQL 17 needs no extensions for UUIDs) |

| 002\_properties.sql | Property catalogue |

| 003\_masterplan\_amenities.sql | Masterplan zones and amenities |

| 004\_anonymous\_sessions.sql | Anonymous visitor sessions |

| 005\_leads\_enquiries.sql | Leads, enquiries, and sales follow-up |

| 006\_campaigns.sql | Campaign attribution |

| 007\_conversations.sql | AI and WhatsApp conversations |

| 008\_knowledge.sql | Knowledge base (Obsidian-synced documents and chunks) |

| 010\_audit\_logs.sql | Governance / audit logging |



Maintained by Kelvin — Database \& Obsidian Knowledge Integration.

