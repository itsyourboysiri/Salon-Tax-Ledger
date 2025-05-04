const express = require('express');
const cors = require('cors');
 require('./mongodb'); 

const userRegRoutes = require('./user/userRegistrationRoute')
const userLoginRoutes = require('./user/userLoginRoute')
const taxFormInsertionRoutes = require('./taxForm/insertTaxForm')
const taxViewRoutes = require('./taxView/taxView')
const taxPaymentRoutes = require('./Payment/taxPayment')
const payHereHashRoutes = require('./Payment/generatePayhereHash');
const paymentInsertionHashRoutes = require('./Payment/savePayment')
const sendEmailRecieptRoutes = require('./Reciepts/emailReceipt')
const fetchUserProfileRoutes = require('./user/fetchUserDataByUsername')
const updateUserProfileRoutes = require('./user/updateUserProfile')
const fetchTaxFormRoutes = require('./taxForm/fetchTaxForm')
const updateTaxFormRoutes = require('./taxForm/updateTaxForm')
const updatePaymentRoutes = require('./Payment/updatePayment')
const getPaymentRoutes = require('./Payment/getPayment')
const updateQuaterlyPaymentRoutes = require('./Payment/updateQuaterlyPayment')
const paymentHistoryRoutes = require('./Payment/paymentHistory')

const retrieveUserRoutes = require('./AdminBackend/Admin-user/retrieveUserDetails')
const updateUserRoutes = require('./AdminBackend/Admin-user/updateUser')
const getUserByTinRoutes = require('./AdminBackend/Admin-user/retireveUserByTin')
const deleteUserByTinRoutes = require('./AdminBackend/Admin-user/deletUser')
const retrieveTaxFilesRoutes = require('./AdminBackend/Admin-TaxInformation/retrieveTaxFiles')
const retrieveTaxFilesByIdRoutes = require('./AdminBackend/Admin-TaxInformation/TaxDetailById')
const confirmTaxFormRoutes = require('./AdminBackend/Admin-TaxInformation/confirmTaxForm');
const declineTaxFormRoutes = require('./AdminBackend/Admin-TaxInformation/declineTaxform')
const getTaxFormRByIdoutes = require('./taxView/taxViewById')
const getAdminPaymentRoutes = require('./AdminBackend/Admin-Payments/getAllPayments')
const getPendingPaymentRoutes = require('./AdminBackend/Admin-Payments/pendingPayments')

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
  console.log(`[${req.method}] ${req.originalUrl}`);
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
app.use("/api/users", getTaxFormRByIdoutes); 
app.use("/api/users", getPaymentRoutes); 
app.use("/api/users", updateQuaterlyPaymentRoutes); 
app.use("/api/users", paymentHistoryRoutes); 

app.use("/api/admin", retrieveTaxFilesRoutes); 
app.use("/api/admin", retrieveUserRoutes);
app.use("/api/admin", updateUserRoutes);
app.use("/api/admin", getAdminPaymentRoutes);
app.use("/api/admin", getUserByTinRoutes);
app.use("/api/admin", deleteUserByTinRoutes);
app.use("/api/admin", retrieveTaxFilesByIdRoutes);
app.use("/api/admin", confirmTaxFormRoutes);
app.use("/api/admin", getPendingPaymentRoutes);
app.use("/api/admin", declineTaxFormRoutes);



// Define routes and middleware
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
module.exports = app;