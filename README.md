# Book Reviews Web Application

This is a web application that allows users to manage and recall information about books they've read. The application integrates with the Open Library Covers API to fetch book covers and utilizes a PostgreSQL database for data persistence.

## Features

- Display books with details including title, author, rating, review, and read date.
- Add new books to the collection with relevant information.
- Edit existing book details.
- Delete books from the collection.
- Sort books by rating or recency.

## Snapshots

### Homepage
![image](https://github.com/user-attachments/assets/222257f3-fc58-403d-ae75-65f63beea712)

### Add a Book
![image](https://github.com/user-attachments/assets/a50f7110-a98e-4cc2-89a5-fe640ec319b2)

### Edit a Book
![image](https://github.com/user-attachments/assets/43a91baf-62fd-4ff0-81c8-4d61c8e22c9d)


## Setup Instructions

1. Clone this repository to your local machine.
2. Install Node.js if you haven't already.
3. Install dependencies by running `npm install`.
4. **Set up the Database**:
   - Ensure PostgreSQL is installed on your system.
   - Create a new database named `book_notes`.
   - Execute the SQL script provided (`schema.sql`) to create the necessary tables and schema in the `book_notes` database.
5. **Configure Database Connection**:
   - Open `index.js` file.
   - Update the database connection details (`user`, `password`, `host`, `port`, `database`) according to your PostgreSQL setup.
6. Run the application using `npm start` or `node index.js`.
7. Access the application in your web browser at `http://localhost:3000`.

## Project Structure

- `index.js`: Contains the main server-side logic and routes.
- `views/`: Directory containing EJS templates for rendering HTML pages.
- `public/`: Directory for static files such as CSS stylesheets and images.
- `package.json`: Configuration file specifying project dependencies and scripts.
- `schema.sql`: SQL script for creating the database schema.

## Dependencies

- [Express.js](https://expressjs.com/): Web framework for Node.js.
- [EJS](https://ejs.co/): Templating engine for generating HTML markup.
- [pg](https://www.npmjs.com/package/pg): PostgreSQL client for Node.js.
- [Axios](https://axios-http.com/): HTTP client for making requests to the Open Library Covers API.
