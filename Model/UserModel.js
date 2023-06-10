const { default: mongoose } = require("mongoose");


const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String
})


export const User = mongoose.model("User", userSchema);
