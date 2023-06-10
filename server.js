
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lokesh:lokeshcz@cluster0.dsoakmx.mongodb.net/eml?retryWrites=true&w=majority";
// app.js

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const cors = require("cors")

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
    });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors());
require("dotenv").config()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Hello</h1>")
})

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;


        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({
            name,
            email,
            password: hashedPassword,
        });


        await user.save();

        res.status(200).json({ message: 'Registration successful' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }


        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }


        const token = jwt.sign({ userId: user._id }, 'shhhhh');

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login failed:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/profile', (req, res) => {

    const token = req.headers.authorization;

    try {

        const decodedToken = jwt.verify(token, 'shhhhh');

        const user = User.findOne({ _id: decodedToken.userId });
        console.log(user)
        res.send(user)
        // User.findById(decodedToken.userId, function (err, docs) {

        //     if (err) {
        //         console.log(err);
        //     }
        //     else {
        //         console.log("Result : ", docs);
        //     }
        // });

        // user.findById(decodedToken.userId, 'name email', (error, user) => {
        //     if (error) {
        //         console.error('Failed to fetch profile:', error);
        //         res.status(500).json({ error: 'Failed to fetch profile' });
        //     } 
        // });
    } catch (error) {
        console.error('Invalid token:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
});

app.post('/calculate-E', (req, res) => {
    const { loanAmount, interestRate, tenure } = req.body;

    const MR = interestRate / 100 / 12;

    const NR = loanAmount * MR * Math.pow(1 + MR, tenure);
    const DE = Math.pow(1 + MR, tenure) - 1;
    const E = NR / DE;

    const IP = E * tenure - loanAmount;
    const TP = E * tenure;

    res.status(200).json({ E, IP, TP });
});

app.post('/logout', (req, res) => {

    res.status(200).json({ message: 'Logout successful' });
});

app.listen(4000, () => {
    console.log('Server is running on port 4000');
});
