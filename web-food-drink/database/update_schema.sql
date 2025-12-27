ALTER TABLE users ADD COLUMN phone VARCHAR(15);
ALTER TABLE users ADD COLUMN dob DATE;
ALTER TABLE users ADD COLUMN gender ENUM('male', 'female', 'other');
ALTER TABLE users ADD COLUMN address TEXT;
ALTER TABLE users ADD COLUMN avatar_url VARCHAR(255);
