DROP POLICY IF EXISTS "Guests can submit an RSVP" ON public.rsvps;

CREATE POLICY "Guests can submit a valid RSVP"
  ON public.rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(name)) BETWEEN 1 AND 100
    AND guests BETWEEN 0 AND 10
    AND (message IS NULL OR char_length(message) <= 1000)
    AND ((attending AND guests >= 1) OR (NOT attending AND guests = 0))
    AND created_at BETWEEN now() - interval '1 minute' AND now() + interval '1 minute'
  );

REVOKE INSERT ON public.rsvps FROM anon, authenticated;
GRANT INSERT (name, attending, guests, message) ON public.rsvps TO anon, authenticated;