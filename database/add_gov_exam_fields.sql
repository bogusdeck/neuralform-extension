-- Add Government Exam Fields to user_profiles table
-- Run this after the initial setup.sql

-- Add new columns for Government Exam forms
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS father_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS mother_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS permanent_address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS current_address TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS state_district TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS institution TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS year_of_passing TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS percentage_cgpa TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS board_university TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS preferred_center TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS subject_preference TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS language_preference TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS id_proof_type TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS id_number TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS disability_status TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS work_experience TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS declaration TEXT;

-- Add comments for documentation
COMMENT ON COLUMN user_profiles.category IS 'Category/Caste (General/OBC/SC/ST/EWS)';
COMMENT ON COLUMN user_profiles.nationality IS 'Nationality';
COMMENT ON COLUMN user_profiles.father_name IS 'Father''s/Husband''s name';
COMMENT ON COLUMN user_profiles.mother_name IS 'Mother''s name';
COMMENT ON COLUMN user_profiles.permanent_address IS 'Permanent address';
COMMENT ON COLUMN user_profiles.current_address IS 'Current address (if different)';
COMMENT ON COLUMN user_profiles.state_district IS 'State/District';
COMMENT ON COLUMN user_profiles.degree IS 'Degree/certificate details';
COMMENT ON COLUMN user_profiles.institution IS 'Institution/university name';
COMMENT ON COLUMN user_profiles.year_of_passing IS 'Year of passing';
COMMENT ON COLUMN user_profiles.percentage_cgpa IS 'Percentage/CGPA/grades';
COMMENT ON COLUMN user_profiles.board_university IS 'Board/university';
COMMENT ON COLUMN user_profiles.preferred_center IS 'Preferred exam center';
COMMENT ON COLUMN user_profiles.subject_preference IS 'Subject/paper preferences';
COMMENT ON COLUMN user_profiles.language_preference IS 'Language preference for exam';
COMMENT ON COLUMN user_profiles.id_proof_type IS 'ID proof type (Aadhaar, PAN, Voter ID, etc.)';
COMMENT ON COLUMN user_profiles.id_number IS 'ID number';
COMMENT ON COLUMN user_profiles.disability_status IS 'Disability status (if applicable)';
COMMENT ON COLUMN user_profiles.work_experience IS 'Work experience (if required)';
COMMENT ON COLUMN user_profiles.declaration IS 'Declaration/undertaking';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Government exam fields added successfully!';
END $$;
