const { default: mongoose } = require("mongoose");


const EMISchema = new mongoose.Schema({
    loan_Amount: String,
    Annual_Interest: String,
    Tenure: String
})


export const EMI = mongoose.model("EMI", EMISchema);
// - **Loan amount**
// - **Annual Interest rate (%)**
// - **Tenure in months**