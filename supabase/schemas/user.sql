CREATE OR REPLACE FUNCTION is_timezone( tz TEXT ) RETURNS BOOLEAN as $$
DECLARE
    date TIMESTAMPTZ;
BEGIN
    date := now() AT TIME ZONE tz;
    RETURN TRUE;
EXCEPTION WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ language plpgsql STABLE;

-- Drop domain if exists
DROP DOMAIN IF EXISTS min2_text;

-- Create domain enforcing min length
CREATE DOMAIN min2_text AS TEXT
CHECK (char_length(VALUE) >= 2);

-- Drop domain to avoid conflict
DROP DOMAIN IF EXISTS iana_timezone;

-- Create a custom data type for valid IANA timezones
CREATE DOMAIN iana_timezone AS min2_text
CHECK ( is_timezone( value ) );

-- Create table that uses the domain
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name min2_text NOT NULL,
  last_name min2_text NOT NULL,
  birthday date NOT NULL,
  timezone iana_timezone NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);