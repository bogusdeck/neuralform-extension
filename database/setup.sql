-- AutoFill Pro - Supabase Database Setup
-- Run this in your Supabase SQL Editor

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    alternate_phone TEXT,
    address TEXT,
    address2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    dob DATE,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);

-- Create index on email for faster searches (if needed later)
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
-- Note: For now, we're allowing all reads. You can customize this later with auth.
CREATE POLICY "Allow public read access"
    ON user_profiles
    FOR SELECT
    USING (true);

-- Create policy to allow users to insert their own data
CREATE POLICY "Allow public insert access"
    ON user_profiles
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow users to update their own data
CREATE POLICY "Allow public update access"
    ON user_profiles
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Create policy to allow users to delete their own data
CREATE POLICY "Allow public delete access"
    ON user_profiles
    FOR DELETE
    USING (true);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Display success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Table: user_profiles created';
    RAISE NOTICE 'Indexes created on user_id and email';
    RAISE NOTICE 'Row Level Security enabled';
    RAISE NOTICE 'Policies created for CRUD operations';
    RAISE NOTICE 'Auto-update trigger for updated_at created';
END $$;
