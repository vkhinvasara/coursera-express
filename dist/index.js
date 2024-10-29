"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
// In-memory data store
const books = [
    { isbn: '1234567890', title: 'Node.js Programming', author: 'John Doe', review: 'Great book!' },
    { isbn: '0987654321', title: 'Learning JavaScript', author: 'Jane Doe', review: 'Very informative!' },
    // Add more books as needed
];
// Method 1: Get all books
app.get('/books', (req, res) => {
    res.json(books);
});
// Method 2: Search by ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book);
    }
    else {
        res.status(404).json({ error: 'Book not found' });
    }
});
// Method 3: Search by Author
app.get('/books/author/:author', (req, res) => {
    const author = req.params.author;
    const booksByAuthor = books.filter(b => b.author === author);
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    }
    else {
        res.status(404).json({ error: 'No books found by this author' });
    }
});
// Method 4: Search by Title
app.get('/books/title/:title', (req, res) => {
    const title = req.params.title;
    const booksByTitle = books.filter(b => b.title === title);
    if (booksByTitle.length > 0) {
        res.json(booksByTitle);
    }
    else {
        res.status(404).json({ error: 'No books found with this title' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
