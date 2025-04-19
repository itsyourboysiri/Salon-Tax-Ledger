import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegistrationForm = () => {

    const navigate = useNavigate()

    // State for the number of stories and area inputs
    const [stories, setStories] = useState(1);

    const increaseStories = () => setStories(stories + 1);
    const decreaseStories = () => setStories(stories > 1 ? stories - 1 : 1);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Get form data using FormData API
        const userRegformData = new FormData(event.target);
        const userregdata = Object.fromEntries(userRegformData.entries());

        // Get the form element
        const form = event.target;
        const phone = form.phone.value.trim();
        const password = form.password.value.trim();
        const email = form.email.value.trim()
        const nic = form.nic.value.trim();
        const tin = form.tinno.value.trim();
        const confirmPassword = form.confirmPassword.value.trim();
        const areaInputs = form.querySelectorAll(".areaInput");

        let isValid = true;


        // Validate NIC
        const oldNICPattern = /^[0-9]{9}[VXvx]$/; // 9 digits + V/X
        const newNICPattern = /^[0-9]{12}$/; // 12 digits only
        if (!oldNICPattern.test(nic) && !newNICPattern.test(nic)) {
            alert("Invalid NIC format (e.g., 123456789V or 200012345678)");
            isValid = false;
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            isValid = false;
            return;
        }

        // Validate TIN (Only numbers)
        if (!/^[0-9]+$/.test(tin)) {
            alert("TIN should only contain numbers");
            isValid = false;
            return;
        }

        // Validate Sri Lankan phone number
        if (!/^0[1-9]\d{8}$/.test(phone)) {
            alert("Invalid Sri Lankan phone number (e.g., 0712345678 or 0112345678)");
            isValid = false;
            return;
        }

        // Validate password strength (6+ chars, at least 1 special character)
        if (password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            alert("Password must be at least 6 characters long and contain at least one special character.");
            isValid = false;
            return;
        }

        // Confirm password check
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            isValid = false;
            return;
        }

        // Validate salon area inputs (must be positive numbers)
        for (let input of areaInputs) {
            if (isNaN(input.value) || Number(input.value) <= 0) {
                alert("Salon area must be a positive number.");
                isValid = false;
                return;
            }
        }

        if (isValid) {
            alert("Form submitted successfully!");
            form.submit();
        }

        // Convert necessary fields to proper data types
        userregdata.stories = stories;
        userregdata.area = Array.from(document.querySelectorAll(".areaInput")).map(input => Number(input.value));

        // Send data using fetch API (plain JS)
        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userregdata)
            });

            if (!response.ok) {
                throw new Error("Registration failed!");
            }
            navigate("/");
            const result = await response.json();
            alert(result.message);
           
        } catch (error) {
            console.error("Error registering user:", error);
            alert("Registration failed!");
        }
    };

    // Generate area input fields based on the number of stories
    const generateAreaInputs = () => (
        <div>
            {[...Array(stories)].map((_, index) => (
                <input
                    key={index}
                    type="number"
                    name={`area${index}`}
                    className="areaInput w-full mt-1 p-2 border rounded-lg"
                    placeholder={`Area of Story ${index + 1}`}
                />
            ))}
        </div>
    );

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">User Registration</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-600">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        name="dob"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-600">Address</label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600">Phone Number</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="nic" className="block text-sm font-medium text-gray-600">National Identity Card</label>
                    <input
                        type="text"
                        id="nic"
                        name="nic"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="tinno" className="block text-sm font-medium text-gray-600">TIN Number</label>
                    <input
                        type="text"
                        id="tinno"
                        name="tinno"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <h2 className="text-2xl font-semibold text-left text-gray-700 mb-3">Salon Details</h2>
                <div>
                    <label htmlFor="salon-name" className="block text-sm font-medium text-gray-600">Salon Name</label>
                    <input
                        type="text"
                        id="salonName"
                        name="salonName"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="salon-address" className="block text-sm font-medium text-gray-600">Salon Address</label>
                    <input
                        type="text"
                        id="salonAddress"
                        name="salonAddress"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">How many stories in the salon?</label>
                    <div className="flex items-center space-x-2 mt-2">
                        <button type="button" onClick={decreaseStories} className="p-2 bg-gray-200 rounded-lg">-</button>
                        <input
                            type="text"
                            id="stories"
                            name="stories"
                            value={stories}
                            readOnly
                            className="w-16 text-center p-2 border rounded-lg  required focus:outline-none"
                        />
                        <button type="button" onClick={increaseStories} className="p-2 bg-gray-200 rounded-lg">+</button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600">Area of the Salon (sq ft)</label>
                    <div id="areaInputs">
                        {generateAreaInputs()}
                    </div>
                </div>
                <h2 className="text-2xl font-semibold text-left text-gray-700 mb-3">Profile Details</h2>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-600">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        className="w-full mt-1 p-2 border rounded-lg focus:outline-none  required focus:ring-2 focus:ring-blue-400"
                    />
                </div>
                <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition">
                    Register
                </button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600">Already have an account?
                <p   className="text-blue-500 hover:underline" onClick={() => navigate('/')}>Sign in</p>
            </p>
        </div>
    );
};

export default UserRegistrationForm;
