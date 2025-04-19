import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserLoginForm() {
    const [userLoginData, setUserLoginData] = useState({ username: '', password: '' });
    const [errors, setErrors] = useState({});
    const [serverMessage, setServerMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserLoginData({ ...userLoginData, [name]: value });
    };

    const validate = () => {
        let tempErrors = {};
        tempErrors.username = userLoginData.username ? '' : 'Username is required';
        tempErrors.password = userLoginData.password ? '' : 'Password is required';
        setErrors(tempErrors);
        return Object.values(tempErrors).every((x) => x === '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerMessage('');
        if (validate()) {
            try {
                const response = await fetch('http://localhost:5000/api/users/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userLoginData),
                });

                const data = await response.json();

                if (response.ok) {
                    setServerMessage('Login successful! Redirecting...');

                    const { username, name, salonName, tinNumber,email } = data.user;

                    //store username in the session     
                    // ✅ Store in sessionStorage
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('salonName', salonName);
                    sessionStorage.setItem('tinNumber', tinNumber);
                    sessionStorage.setItem('email', email);


                    setTimeout(() => {
                        navigate("/homepage")
                    }, 1500

                    )

                } else {
                    setServerMessage(data.message || 'Invalid username or password');
                }
            } catch (error) {
                setServerMessage('Server error. Please try again later.');
            }
        }
    };

    return (

        <div className="bg-opacity-30 backdrop-blur-lg p-8 sm:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg ml-6 sm:ml-12">
            <div className="flex justify-center ">
                <img src="/logo.png" alt="Logo" className="w-80 sm:w-80" />
            </div>
            <h2 className="text-xl sm:text-3xl font-semibold text-center text-white ">User Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-white mb-2 text-base sm:text-lg">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={userLoginData.username}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-transparent border border-white text-white rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base sm:text-lg"
                    />
                    {errors.username && <p className="text-red-500 text-sm sm:text-base mt-1">{errors.username}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-white mb-2 text-base sm:text-lg">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={userLoginData.password}
                        onChange={handleChange}
                        className="w-full px-5 py-3 bg-transparent border border-white text-white rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-base sm:text-lg"
                    />
                    {errors.password && <p className="text-red-500 text-sm sm:text-base mt-1">{errors.password}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-yellow-400 text-black font-bold py-3 rounded-full hover:bg-yellow-500 transition text-base sm:text-lg"
                >
                    Submit
                </button>
            </form>
            {serverMessage && <p className="text-white text-center mt-4">{serverMessage}</p>}
            <p
                className="text-white text-center mt-6 text-base sm:text-lg cursor-pointer hover:underline"
                onClick={() => navigate('/signup')}
            >
                Create an account
            </p>
        </div>

    );
}

export default UserLoginForm;