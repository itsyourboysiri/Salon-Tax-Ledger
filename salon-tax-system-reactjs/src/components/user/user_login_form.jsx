import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alert } from '../AlertBoxes/alertBox';

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

                    const { username, name, salonName, tinNumber, email, photo } = data.user;

                    //store username in the session     
                    // ✅ Store in sessionStorage
                    sessionStorage.setItem('username', username);
                    sessionStorage.setItem('name', name);
                    sessionStorage.setItem('salonName', salonName);
                    sessionStorage.setItem('tinNumber', tinNumber);
                    sessionStorage.setItem('email', email);
                    sessionStorage.setItem('photo', `http://localhost:5000/api/users${photo}` || '');


                    setTimeout(() => {
                        alert.success("Login Successfull")
                        navigate("/homepage")
                    }, 1500

                    )

                } else {
                    alert.error(data.message || 'Invalid username or password');
                }
            } catch (error) {
                alert.error('Server error. Please try again later.');
            }
        }
    };

    return (

        <div className="bg-opacity-30 backdrop-blur-lg p-8 sm:p-10 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg ml-6 sm:ml-12">
    <div className="flex justify-center"></div>
    <h2 className="text-xl sm:text-3xl font-semibold text-center text-white">User Login</h2>
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
            className="
                w-full 
                py-3 
                rounded-full 
                font-bold
                text-black
                bg-gradient-to-r from-yellow-400 to-yellow-600
                hover:from-yellow-500 hover:to-yellow-700
                shadow-lg
                hover:shadow-yellow-500/50
                transition-all
                duration-300
                hover:scale-[1.02]
                relative
                overflow-hidden
                group
                text-base sm:text-lg
            "
        >
            <span className="relative z-10">Login</span>
            <span className="
                absolute inset-0
                bg-gradient-to-r from-yellow-500 to-yellow-700
                opacity-0
                group-hover:opacity-100
                transition-opacity
                duration-300
                rounded-full
            "></span>
        </button>
    </form>
  
    <div className="mt-6 flex flex-col items-center">
        <p className="text-white text-center mb-3 text-base sm:text-lg">
            Don't have an account?
        </p>
        <button
            onClick={() => navigate('/signup')}
            className="
                w-full
                px-6 py-2
                font-bold
                text-yellow-400
                border-2 border-yellow-400
                rounded-full
                hover:bg-yellow-400/10
                hover:text-yellow-300
                hover:border-yellow-300
                transition-all
                duration-300
                hover:scale-[1.02]
                shadow-md
                hover:shadow-yellow-400/30
                text-base sm:text-lg
            "
        >
            Create an account
        </button>
    </div>
</div>

    );
}

export default UserLoginForm;