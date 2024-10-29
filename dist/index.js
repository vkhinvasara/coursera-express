"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// In-memory data store
const books = [
    { isbn: '1234567890', title: 'Node.js Programming', author: 'John Doe', review: 'Great book!' },
    { isbn: '0987654321', title: 'Learning JavaScript', author: 'Jane Doe', review: 'Very informative!' },
    // Add more books as needed
];
const users = [];
// Method 1: Get all books using async callback function
function getAllBooks(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Simulate async operation
            const data = yield new Promise((resolve) => setTimeout(() => resolve(books), 100));
            callback(null, data);
        }
        catch (error) {
            callback(error);
        }
    });
}
app.get('/books', (req, res) => {
    getAllBooks((error, data) => {
        if (error) {
            res.status(500).json({ error: error.message });
        }
        else {
            res.json(data);
        }
    });
});
// Method 2: Search by ISBN using Promises
function searchByISBN(isbn) {
    return new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === isbn);
        if (book) {
            resolve(book);
        }
        else {
            reject(new Error('Book not found'));
        }
    });
}
app.get('/books/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    searchByISBN(isbn)
        .then(book => res.json(book))
        .catch(error => res.status(404).json({ error: error.message }));
});
// Method 3: Search by Author using async/await
function searchByAuthor(author) {
    return __awaiter(this, void 0, void 0, function* () {
        const booksByAuthor = books.filter(b => b.author === author);
        if (booksByAuthor.length > 0) {
            return booksByAuthor;
        }
        else {
            throw new Error('No books found by this author');
        }
    });
}
app.get('/books/author/:author', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = req.params.author;
    try {
        const booksByAuthor = yield searchByAuthor(author);
        res.json(booksByAuthor);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}));
// Method 4: Search by Title using async/await
function searchByTitle(title) {
    return __awaiter(this, void 0, void 0, function* () {
        const booksByTitle = books.filter(b => b.title === title);
        if (booksByTitle.length > 0) {
            return booksByTitle;
        }
        else {
            throw new Error('No books found with this title');
        }
    });
}
app.get('/books/title/:title', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.params.title;
    try {
        const booksByTitle = yield searchByTitle(title);
        res.json(booksByTitle);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
}));
// Method 6: Register New User
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'User already exists' });
    }
    users.push({ username, password });
    res.status(201).json({ message: 'User registered successfully' });
});
// Method 7: Login as a Registered User
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    }
    else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});
// Method 8: Add/Modify a Book Review
app.put('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    if (!review) {
        return res.status(400).json({ error: 'Review is required' });
    }
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        book.review = review;
        res.status(200).json({ message: 'Review updated successfully', book });
    }
    else {
        res.status(404).json({ error: 'Book not found' });
    }
});
// Method 9: Delete Book Review
app.delete('/books/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        if (book.review && users.some(user => user.username === username)) {
            book.review = '';
            res.status(200).json({ message: 'Review deleted successfully', book });
        }
        else {
            res.status(403).json({ error: 'You are not authorized to delete this review' });
        }
    }
    else {
        res.status(404).json({ error: 'Book not found' });
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
