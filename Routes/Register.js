

const express = require("express")
const cors = require("cors")

const app = express();
// const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../Model/UserModel");
const UserRegisterRouter = express.Router()

app.use(cors());


UserRegisterRouter.post("/register", async (req, res) => {
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



UserRegisterRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email });

        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        UserID: user._id, userName: user.name
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




// export default UserRegisterRouter