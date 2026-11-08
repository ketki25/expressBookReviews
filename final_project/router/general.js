
const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");

let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// Get all books
public_users.get('/', async (req, res) => {
    try {
        return res.status(200).json(books);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books"
        });
    }
});

// Get book by ISBN (or book ID in starter database)
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        const book = books[isbn] ||
            Object.values(books).find(
                item => String(item.isbn) === isbn
            );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        return res.status(200).json(book);
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book"
        });
    }
});

// Get books by author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();

        const result = Object.values(books).filter(
            book => book.author.toLowerCase().includes(author)
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Error searching author"
        });
    }
});

// Get books by title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();

        const result = Object.values(books).filter(
            book => book.title.toLowerCase().includes(title)
        );

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            message: "Error searching title"
        });
    }
});

// Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    const book = books[isbn] ||
        Object.values(books).find(
            item => String(item.isbn) === isbn
        );

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.status(200).json(book.reviews);
});

const BASE_URL = "http://localhost:5000";

// Get all books using Axios
async function getAllBooks() {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
}

// Get book by ISBN
async function getBooksByISBN(isbn) {
    const response = await axios.get(
        `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
    );
    return response.data;
}

// Get books by author
async function getBooksByAuthor(author) {
    const response = await axios.get(
        `${BASE_URL}/author/${encodeURIComponent(author)}`
    );
    return response.data;
}

// Get books by title
async function getBooksByTitle(title) {
    const response = await axios.get(
        `${BASE_URL}/title/${encodeURIComponent(title)}`
    );
    return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBooksByISBN = getBooksByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
