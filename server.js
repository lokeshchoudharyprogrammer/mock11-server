
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://lokesh:lokeshcz@cluster0.dsoakmx.mongodb.net/emicalulater?retryWrites=true&w=majority";
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose");
const app = express();

app.use(cors());
require("dotenv").config()
app.use(express.json())

app.get("/", (req, res) => {
    res.send("<h1>Welcome To my server</h1>")
})



app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        const exit = await User.findOne({ email });

        if (exit) {
            return res.status(400).json({ "message": "Already Exit " })
        }
        bcrypt.hash(password, 5, async (err, hash) => {

            const user = new User({
                name,
                email,
                password: hash
            });
            await user.save()


            res.status(201).json({ message: "User Created Now" })

        })

    } catch (error) {
        res.status(400).json({ "error": "error " })
    }
})



app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email });

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        UserID: user._id, userName: user.name, email: user.email
                    }, "shhhhh");

                    res.status(200).json({
                        message: "Login Success",
                        token,
                        Name: user.name,
                        UserId: user._id
                    })
                } else {
                    res.status(400).json({ "error": "Wrong Password " })
                }

            });
        } else {
            res.status(400).json({ "error": "Wrong Password " })

        }


    } catch (error) {
        res.status(400).json({ "error": "error " })
    }
})

app.get("/GetProfile", (req, res) => {
    let tokens = req.headers.authorization;
    try {

        let decodeToken = jwt.verify(token, "shhhhh");

        User.findById(tokens.userID, tokens.email, (err, user) => {
            if (err) {
                console.log("err")
                res.status(500).json({ error: "Failed" })
            } else if (!user) {
                res.status(400).json({ error: "user not found" })

            } else {
                res.status(200).json({ user })
            }
        })
    } catch (error) {

        console.log("Invalid Data")
        res.status(401).json({ "error": "Token Invalid" })
    }


})

app.post("/logout", (req, res) => {
    console.log("Logout")
    res.status(200).json({ message: "Logout" })
})


app.post("/calculate", (req, res) => {

    const { loanAmout, intrestrate, tenure } = req.body;

    // EMI:E = P x r x ( 1 + r )n / ( ( 1 + r )n - 1 ) 
    // EMI = ₹1,00,000 * 0.011667* (1 + 0.011667)36 / ((1 + 0.011667)36 - 1) = ₹3418.
    const month = intrestrate / 100 / 12;
    const nrate = loanAmout * month * Math.pow(1 + month, tenure);
    const denom = Math.pow(1 + month, tenure) - 1
    const emi = nrate / denom;

    const inpay = emi * tenure - loanAmout;
    const totalPay = emi * tenure;

    res.status(200).json({ emi, inpay, totalPay })
    // const Mon
})
app.listen(4000, async () => {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await mongoose.connect(uri);
        // Send a ping to confirm a successful connection

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch {
        console.log("Try Again");
        // Ensures that the client will close when you finish/error

    }
})
