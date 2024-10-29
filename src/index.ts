import express, { Request, Response } from 'express';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory data store
const books = [
    { isbn: '1234567890', title: 'Node.js Programming', author: 'John Doe', review: 'Great book!' },
    { isbn: '0987654321', title: 'Learning JavaScript', author: 'Jane Doe', review: 'Very informative!' },
    // Add more books as needed
];

interface User {
    username: string;
    password: string;
}

const users: User[] = [];

// Method 1: Get all books using async callback function
async function getAllBooks(callback: (error: any, data?: any) => void) {
    try {
        // Simulate async operation
        const data = await new Promise((resolve) => setTimeout(() => resolve(books), 100));
        callback(null, data);
    } catch (error) {
        callback(error);
    }
}

app.get('/books', (req: Request, res: Response) => {
    getAllBooks((error, data) => {
        if (error) {
            res.status(500).json({ error: error.message });
        } else {
            res.json(data);
        }
    });
});

// Method 2: Search by ISBN using Promises
function searchByISBN(isbn: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === isbn);
        if (book) {
            resolve(book);
        } else {
            reject(new Error('Book not found'));
        }
    });
}

app.get('/books/isbn/:isbn', (req: Request, res: Response) => {
    const isbn = req.params.isbn;
    searchByISBN(isbn)
        .then(book => res.json(book))
        .catch(error => res.status(404).json({ error: error.message }));
});

// Method 3: Search by Author using async/await
async function searchByAuthor(author: string): Promise<any> {
    const booksByAuthor = books.filter(b => b.author === author);
    if (booksByAuthor.length > 0) {
        return booksByAuthor;
    } else {
        throw new Error('No books found by this author');
    }
}

app.get('/books/author/:author', async (req: Request, res: Response) => {
    const author = req.params.author;
    try {
        const booksByAuthor = await searchByAuthor(author);
        res.json(booksByAuthor);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Method 4: Search by Title using async/await
async function searchByTitle(title: string): Promise<any> {
    const booksByTitle = books.filter(b => b.title === title);
    if (booksByTitle.length > 0) {
        return booksByTitle;
    } else {
        throw new Error('No books found with this title');
    }
}

app.get('/books/title/:title', async (req: Request, res: Response) => {
    const title = req.params.title;
    try {
        const booksByTitle = await searchByTitle(title);
        res.json(booksByTitle);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Method 6: Register New User
app.post('/register', (req: Request, res: Response) => {
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
app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

// Method 8: Add/Modify a Book Review
app.put('/books/review/:isbn', (req: Request, res: Response) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    if (!review) {
        return res.status(400).json({ error: 'Review is required' });
    }
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        book.review = review;
        res.status(200).json({ message: 'Review updated successfully', book });
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Method 9: Delete Book Review
app.delete('/books/review/:isbn', (req: Request, res: Response) => {
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
        } else {
            res.status(403).json({ error: 'You are not authorized to delete this review' });
        }
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});