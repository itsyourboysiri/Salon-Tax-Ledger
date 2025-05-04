const mongoose = require("mongoose");

const taxFormSchema = new mongoose.Schema({
  username: String,
  name: String,
  salonName: String,
  tinNumber: String,
  assessableIncome: Number,
  totalDeductions: Number,
  taxableIncome: Number,
  totalTaxLiable: Number,
  withHoldingTax: Number,
  installment: Number,
  apit: Number,
  totalTaxPaid: Number,
  balancePayable: Number,
  finalPayment: Number,

  totalBusinessIncome: Number,
  totalEmployeeIncome: Number,
  totalOtherIncome: Number,
  totalForeignIncome: Number,
  totalInvestmentIncome: Number,

  employeeIncomeEntries: Array,
  businessIncomeEntries: Array,
  investmentIncomeEntries: Object,
  otherIncomeEntries: Array,
  foreignIncomeEntries: Array,

  qualifyingPaymentsEntries: Array,
  reliefEntries: Array,
  taxCreditsData: Object,
  paymentId: String,
  status:String,

  submittedAt: Date,
}, { timestamps: true });

// Use consistent model name
module.exports = mongoose.models.taxform_collections || mongoose.model('taxform_collections', taxFormSchema);
