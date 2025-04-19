import React from 'react';
import UserLoginForm from '../components/user/user_login_form';

function UserLogin() {
    return (
    
        
        <div className="relative w-full h-screen bg-[url('/sltax.jpg')] bg-cover bg-center bg-no-repeat flex items-center">
            
            {/* Form Container - Left Aligned */}
            <div className="flex items-center md:items-start justify-center md:justify-start min-h-screen w-full px-4 sm:px-6 md:pl-6 lg:pl-12">
                <div className="w-full max-w-md  p-6 md:ml-16 lg:ml-16">
                    <UserLoginForm />
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
