-- Update the contact_type constraint to include 'other'
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_contact_type_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_contact_type_check 
CHECK (contact_type IN ('facebook', 'phone', 'email', 'other'));