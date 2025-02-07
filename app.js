

// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(express.static('./public'));
// app.use(bodyParser.json());
// app.use(cors());

// // MongoDB Connection
// const mongoUrl = 'mongodb+srv://pradham:Pradham1%40@backendproject.gjs8y.mongodb.net/test?retryWrites=true&w=majority';

// mongoose.connect(mongoUrl)
//     .then(() => console.log('Connected to MongoDB'))
//     .catch(err => console.error('MongoDB Connection Error:', err));

// // User Schema
// const UserSchema = new mongoose.Schema({
//     username: String,
//     password: String,
// });

// const User = mongoose.model('User', UserSchema);

// // Login Endpoint
// app.post('/login', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const user = await User.findOne({ username, password });

//         if (user) {
//             res.json({ success: true, message: 'Login successful', redirectUrl: '/features.html' });
//         } else {
//             res.json({ success: false, message: 'User not found. Redirecting to sign-up.', redirectUrl: '/signup.html' });
//         }
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// // Signup Endpoint
// app.post('/signup', async (req, res) => {
//     const { username, password } = req.body;

//     try {
//         const existingUser = await User.findOne({ username });
//         if (existingUser) {
//             return res.json({ success: false, message: 'Username already exists. Try another one.' });
//         }

//         const newUser = new User({ username, password });
//         await newUser.save();

//         res.json({ success: true, message: 'Account created successfully!' });
//     } catch (error) {
//         console.error('Error during signup:', error);
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// });

// // Start Server
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoUrl = 'mongodb+srv://pradham:Pradham1%40@backendproject.gjs8y.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoUrl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Login Endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.json({ success: false, message: 'User not found. Redirecting to sign-up.', redirectUrl: '/signup.html' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.json({ success: false, message: 'Invalid password. Please try again.' });
        }

        res.json({ success: true, message: 'Login successful', redirectUrl: '/features.html' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Signup Endpoint
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.json({ success: false, message: 'Username already exists. Try another one.' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.json({ success: true, message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


