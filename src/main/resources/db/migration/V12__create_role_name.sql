INSERT INTO roles (id, name, created_at, updated_at, is_deleted)
VALUES
    (gen_random_uuid(), 'ADMIN', now(), now(), false),
    (gen_random_uuid(), 'USER', now(), now(), false)
    ON CONFLICT (name) DO NOTHING;