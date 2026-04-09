-- Run this on the Supabase SQL Editor to update your Cases table

ALTER TABLE public."Cases"
ADD COLUMN IF NOT EXISTS outcome TEXT,
ADD COLUMN IF NOT EXISTS market TEXT,
ADD COLUMN IF NOT EXISTS conduct TEXT,
ADD COLUMN IF NOT EXISTS theory_of_harm TEXT,
ADD COLUMN IF NOT EXISTS economics_issues TEXT,
ADD COLUMN IF NOT EXISTS decision TEXT;
