// Import necessary modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Initialize Express application
const app = express();
const port = 3000;

// Retrieve directory and file paths for use in the application
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup PostgreSQL client configuration
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "book_notes",
  password: "password",
  port: 5432,
});

// Connect to the database
db.connect();

// Configure EJS as the templating engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware for parsing body of POST requests and serving static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Define route for homepage to display books, potentially with sorting
app.get('/', async (req, res) => {
    const sort = req.query.sort || 'recent'; // Determine sorting from query or default to recent
    let orderBy; // Variable to hold ORDER BY clause for SQL query

    // Sorting logic
    switch (sort) {
        case 'rating':
            orderBy = 'rating DESC, read_date DESC';
            break;
        case 'recent':
        default:
            orderBy = 'read_date DESC, rating DESC';
            break;
    }

    try {
        // Query database to fetch books based on sorting
        const dbRes = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
        const books = dbRes.rows;

        // Add cover images to each book using Open Library API, with error handling for missing covers
        const booksWithCovers = await Promise.all(books.map(async (book) => {
            if (book.isbn) {
                const url = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;
                try {
                    await axios.get(url);
                    book.cover = url;
                } catch (error) {
                    book.cover = '/images/default_cover.jpg';
                }
            } else {
                book.cover = '/images/default_cover.jpg';
            }
            return book;
        }));

        // Render the homepage with books data and current sorting option
        res.render('index', { books: booksWithCovers, sort: sort });
    } catch (err) {
        console.error(err);
        res.send('Failed to retrieve books');
    }
});

// Route for displaying the add book form
app.get('/add-book', (req, res) => {
  res.render('add-book');
});

// Route for handling POST request to add a new book
app.post('/add-book', async (req, res) => {
  const { title, author, isbn, rating, read_date, review } = req.body;
  try {
    await db.query('INSERT INTO books (title, author, isbn, rating, read_date, review) VALUES ($1, $2, $3, $4, $5, $6)', 
    [title, author, isbn, rating, read_date, review]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Failed to add book');
  }
});

// Route for displaying edit form with current book details
app.get('/edit-book/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    res.render('edit-book', { book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.send('Failed to retrieve the book');
  }
});

// Route for handling POST request to update book details
app.post('/update-book/:id', async (req, res) => {
  const id = req.params.id;
  const { title, author, isbn, rating, read_date, review } = req.body;
  try {
    await db.query('UPDATE books SET title = $1, author = $2, isbn = $3, rating = $4, read_date = $5, review = $6 WHERE id = $7', 
    [title, author, isbn, rating, read_date, review, id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Failed to update book');
  }
});

// Route for handling book deletion
app.post('/delete-book/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await db.query('DELETE FROM books WHERE id = $1', [id]);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.send('Failed to delete book');
  }
});

// Start the server and log the listening port
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
