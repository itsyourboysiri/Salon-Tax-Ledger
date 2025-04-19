
const ReceiptPreview = ({ data }) => {
    const {
      name,
      email,
      tinNumber,
      salonName,
      paymentType,
      taxYear,
      amountPaid,
      payHereOrderId,
      paymentDate
    } = data;
  
    return (
      <div id="receipt" className="p-6 w-[500px] bg-white text-black rounded-md shadow-lg">
        <h2 className="text-xl font-bold text-center mb-4">Income Tax Payment Receipt</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>TIN Number:</strong> {tinNumber}</p>
        <p><strong>Salon Name:</strong> {salonName}</p>
        <p><strong>Payment Type:</strong> {paymentType}</p>
        <p><strong>Tax Year:</strong> {taxYear}</p>
        <p><strong>Amount Paid:</strong> LKR {amountPaid}</p>
        <p><strong>Order ID:</strong> {payHereOrderId}</p>
        <p><strong>Payment Date:</strong> {paymentDate}</p>
      </div>
    );
  };
  
  export default ReceiptPreview;
  