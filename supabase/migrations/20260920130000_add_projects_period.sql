-- Add an optional date range to projects (e.g. "2024 — now")
alter table public.projects add column if not exists period text;
