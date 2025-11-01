-- Create categories table for planogram images
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  planogram_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create refrigerators table
CREATE TABLE public.refrigerators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number TEXT NOT NULL UNIQUE,
  store_name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refrigerators ENABLE ROW LEVEL SECURITY;

-- Public read access for field agents to view data
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view refrigerators"
  ON public.refrigerators FOR SELECT
  USING (true);

-- Admin policies (only authenticated users can modify)
CREATE POLICY "Authenticated users can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update categories"
  ON public.categories FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete categories"
  ON public.categories FOR DELETE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert refrigerators"
  ON public.refrigerators FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update refrigerators"
  ON public.refrigerators FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete refrigerators"
  ON public.refrigerators FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_refrigerators_updated_at
  BEFORE UPDATE ON public.refrigerators
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample categories
INSERT INTO public.categories (name, planogram_url) VALUES
  ('Supermarket', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800'),
  ('Kiosk', 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?w=800'),
  ('Café', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800'),
  ('Bar', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800'),
  ('Gas Station', 'https://images.unsplash.com/photo-1611686999018-21e966bae269?w=800');

-- Insert sample refrigerators
INSERT INTO public.refrigerators (serial_number, store_name, category_id)
SELECT 
  'FR123456789',
  'Kiosk №24',
  id
FROM public.categories
WHERE name = 'Kiosk'
LIMIT 1;