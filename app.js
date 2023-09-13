const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;
const secretKey = 'your-secret-key'; // Change this to your secret key


//first put this cors in top
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the actual URL of your React.js app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


app.use(bodyParser.json());

// Endpoint for user authentication
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // In a real application, you should validate the username and password here.
    // For simplicity, we'll assume valid credentials.

    // Create a JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    res.json({ token });
});

// Protected endpoint
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route!' });
});

function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token is not valid' });
        }

        req.username = decoded.username;
        next();
    });
}



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
