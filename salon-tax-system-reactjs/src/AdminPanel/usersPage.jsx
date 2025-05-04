import React, { useState, useEffect } from 'react';
import { FiSearch, FiEdit, FiTrash2 } from 'react-icons/fi';
import TopAndSideBar from './Dashboard Components/sideBar';
import EditUsers from './Dashboard Components/editUser';

const UsersPage = () => {
    const [userData, setUserData] = useState([]); // ✅ actual fetched data
    const [entriesToShow, setEntriesToShow] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [editUser, setEditUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(false);

    // ✅ Fetch data on mount
    useEffect(() => {
        fetch('http://localhost:5000/api/admin/all-users')
            .then(res => res.json())
            .then(data => {
                // ensure photo and area fallback
                const cleanedData = data.map(user => ({
                    ...user,
                    photo: user.photo || '',
                    area: Array.isArray(user.area) ? user.area : [],
                }));
                setUserData(cleanedData);
            });


    }, []);

    const filteredData = userData.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const totalEntries = filteredData.length;
    const totalPages = Math.ceil(totalEntries / entriesToShow);
    const startIndex = (currentPage - 1) * entriesToShow;
    const endIndex = startIndex + entriesToShow;
    const currentData = filteredData.slice(startIndex, endIndex);

    const handleEntriesChange = (e) => {
        setEntriesToShow(Number(e.target.value));
        setCurrentPage(1);
    };
    const handleDeleteClick = async (tin) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:5000/api/admin/delete-user/${tin}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to delete user');
            }

            // Remove the user from the state
            setUserData((prev) => prev.filter((user) => user.TINnumber !== tin));
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Delete failed:', error);
            alert('An error occurred while deleting the user.');
        }
    };

    const handleEditClick = async (user) => {
        setLoadingUser(true);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/${user.TINnumber}`);
            const fullUser = await res.json();
            console.log("Retrieved user:", fullUser)

            if (!res.ok) throw new Error('User not found');

            const parsedUser = {
                ...fullUser,
                photo: fullUser.photo || '',
                area: Array.isArray(fullUser.area) ? fullUser.area : [],
            };

            setEditUser(parsedUser);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch user');
        } finally {
            setLoadingUser(false);
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditUser((prevUser) => ({
            ...prevUser,
            [name]: name === 'area'
                ? Array.isArray(value)
                    ? value // already an array (from story area change)
                    : value.split(',').map((v) => parseFloat(v.trim())).filter(Boolean) // fallback for comma input
                : value,
        }));
    };


    const handleModalClose = () => {
        setEditUser(null);
        setShowModal(false);
    };


    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }

    const columns = [
        { key: 'TINnumber', label: 'TIN Number' },
        { key: 'name', label: 'Name' },
        { key: 'salonName', label: 'Salon Name' },
        { key: 'email', label: 'Email' },
        { key: 'action', label: 'Action' }
    ];

    const handleUpdate = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/update-user/${editUser.TINnumber}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editUser)
            });

            const updated = await res.json();
            if (res.ok) {
                setUserData(prev => prev.map(user => user.TINnumber === editUser.TINnumber ? updated : user));
                handleModalClose();
            } else {
                console.error('Update failed', updated);
            }
        } catch (err) {
            console.error('Error updating user:', err);
        }
    };

    return (
        <TopAndSideBar>
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-full border border-gray-200 flex flex-col overflow-hidden">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 flex-shrink-0">Users</h2>

                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>Show</span>
                        <select
                            value={entriesToShow}
                            onChange={handleEntriesChange}
                            className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                        <span>entries</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border border-gray-300 rounded px-3 py-1.5 pl-8 w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <FiSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>

                <div className="flex-grow overflow-auto border border-gray-200 rounded">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                {columns.map(col => (
                                    <th
                                        key={col.key}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0"
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentData.length > 0 ? (
                                currentData.map((row, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.TINnumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            <div className="flex items-center space-x-3">
                                                {/* <div className="w-10 h-10 flex-shrink-0 rounded-full overflow-hidden border border-gray-300 bg-gray-100">
                                                    <img
                                                        src={row.photo || '/default-avatar.png'}
                                                        alt={row.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/default-avatar.png';
                                                        }}
                                                    />
                                                </div> */}
                                                <span>{row.name}</span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.salonName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex items-center space-x-3">
                                                <button className="text-blue-600 hover:text-blue-800" onClick={() => handleEditClick(row)}><FiEdit size={16} /></button>
                                                <button
                                                    className="text-red-600 hover:text-red-800"
                                                    onClick={() => handleDeleteClick(row.TINnumber)}
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                        No matching records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <EditUsers
                    editUser={editUser}
                    onClose={handleModalClose}
                    onChange={handleEditChange}
                    onUpdate={handleUpdate}
                />


                <div className="flex justify-between items-center mt-4 text-sm text-gray-600 flex-shrink-0">
                    <div>
                        Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, totalEntries)} of {totalEntries} entries
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 border border-gray-300 rounded-l text-sm ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 border-t border-b border-blue-500 bg-blue-500 text-white text-sm font-medium z-10">
                            {currentPage}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages || totalEntries === 0}
                            className={`px-3 py-1 border border-gray-300 rounded-r text-sm ${currentPage === totalPages || totalEntries === 0 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </TopAndSideBar>
    );
};

export default UsersPage;
