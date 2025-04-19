const express = require('express');
const cors = require('cors');
 require('./mongodb'); 

const userRegRoutes = require('./user/userRegistrationRoute')
const userLoginRoutes = require('./user/userLoginRoute')
const taxFormInsertionRoutes = require('./taxForm/insertTaxForm')
const taxViewRoutes = require('./taxView/taxView')
const taxPaymentRoutes = require('./Payment/taxPayment')
const payHereHashRoutes = require('./Payment/generatePayhereHash')
const paymentInsertionHashRoutes = require('./Payment/savePayment')
const sendEmailRecieptRoutes = require('./Reciepts/emailReceipt')
const fetchUserProfileRoutes = require('./user/fetchUserDataByUsername')
const updateUserProfileRoutes = require('./user/updateUserProfile')
const fetchTaxFormRoutes = require('./taxForm/fetchTaxForm')
const updateTaxFormRoutes = require('./taxForm/updateTaxForm')
const updatePaymentRoutes = require('./Payment/updatePayment')


const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: 'http://localhost:5173', // ✅ allow only your frontend origin
    credentials: true, // ✅ allow cookies, credentials, etc.
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use((req, res, next) => {
  console.log(`👉 [${req.method}] ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/users/register", userRegRoutes);
app.use("/api/users/login", userLoginRoutes);
app.use("/api/users", taxFormInsertionRoutes);
app.use("/api/users", taxViewRoutes);
app.use("/api/users", taxPaymentRoutes);
app.use("/api/users", payHereHashRoutes);
app.use("/api/users", paymentInsertionHashRoutes);
app.use("/api/users", sendEmailRecieptRoutes);
app.use("/api/users", fetchUserProfileRoutes);
app.use("/api/users", updateUserProfileRoutes);
app.use("/api/users", fetchTaxFormRoutes);
app.use("/api/users", updateTaxFormRoutes);
app.use("/api/users", updatePaymentRoutes);

// Define routes and middleware
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
