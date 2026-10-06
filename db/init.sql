CREATE TABLE IF NOT EXISTS todos (
    id         SERIAL PRIMARY KEY,
    title      TEXT        NOT NULL CHECK (char_length(trim(title)) > 0),
    completed  BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
