const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    NIC:{ type: String, required: true },
    TINnumber :{ type: Number, required: true },
    salonName: { type: String, required: true },
    salonAddress: { type: String, required: true },
    stories: { type: Number, required: true },
    area: { type: [Number], required: true },
    username: { type: String, required: true, unique: true },
    email:{type: String, required: true},
    password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
