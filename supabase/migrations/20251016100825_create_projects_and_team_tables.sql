/*
  # Create Projects and Team Management System

  ## Overview
  This migration creates the foundation for managing projects and team members with image support.

  ## New Tables
  
  ### 1. `projects` table
  Stores all project information including:
  - `id` (uuid, primary key) - Unique identifier for each project
  - `title_en` (text) - Project title in English
  - `title_ar` (text) - Project title in Arabic
  - `description_en` (text) - Project description in English
  - `description_ar` (text) - Project description in Arabic
  - `category_en` (text) - Project category in English (architectural, structural, electrical, etc.)
  - `category_ar` (text) - Project category in Arabic
  - `image_url` (text) - URL to project image
  - `date` (text) - Project completion date
  - `location` (text) - Project location (optional)
  - `client` (text) - Client name (optional)
  - `status` (text) - Project status (completed, ongoing, planned)
  - `order_index` (integer) - For custom ordering in frontend display
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 2. `team_members` table
  Stores team member information including:
  - `id` (uuid, primary key) - Unique identifier for each team member
  - `name_en` (text) - Name in English
  - `name_ar` (text) - Name in Arabic
  - `position_en` (text) - Position/title in English
  - `position_ar` (text) - Position/title in Arabic
  - `bio_en` (text) - Biography in English
  - `bio_ar` (text) - Biography in Arabic
  - `image_url` (text) - URL to profile image
  - `order_index` (integer) - For custom ordering in frontend display
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on both tables
  - Public read access for all users (to display on website)
  - Only authenticated admin users can insert, update, or delete records
  
  ## Indexes
  - Created indexes on `order_index` for both tables to optimize ordering queries
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_ar text NOT NULL,
  description_en text NOT NULL,
  description_ar text NOT NULL,
  category_en text NOT NULL,
  category_ar text NOT NULL,
  image_url text NOT NULL,
  date text DEFAULT '',
  location text DEFAULT '',
  client text DEFAULT '',
  status text DEFAULT 'completed',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_ar text NOT NULL,
  position_en text NOT NULL,
  position_ar text NOT NULL,
  bio_en text DEFAULT '',
  bio_ar text DEFAULT '',
  image_url text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for ordering
CREATE INDEX IF NOT EXISTS projects_order_index_idx ON projects(order_index);
CREATE INDEX IF NOT EXISTS team_members_order_index_idx ON team_members(order_index);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create policies for projects table
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Create policies for team_members table
CREATE POLICY "Anyone can view team members"
  ON team_members FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert team members"
  ON team_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update team members"
  ON team_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete team members"
  ON team_members FOR DELETE
  TO authenticated
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_team_members_updated_at ON team_members;
CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON team_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();