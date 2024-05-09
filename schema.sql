-- Create the 'books' table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    rating INTEGER,
    read_date DATE,
    review TEXT
);
