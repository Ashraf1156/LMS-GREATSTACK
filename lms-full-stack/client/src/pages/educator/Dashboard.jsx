import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/student/Loading';

const Dashboard = () => {
    // Removed currency from context as it's no longer used here
    const { backendUrl, isEducator, getToken } = useContext(AppContext);

    const [dashboardData, setDashboardData] = useState(null);

    const fetchDashboardData = async () => {
        try {
            const token = await getToken();
            const { data } = await axios.get(backendUrl + '/api/educator/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success) {
                setDashboardData(data.dashboardData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isEducator) {
            fetchDashboardData();
        }
    }, [isEducator, getToken]); // Added getToken dependency

    // Removed unused studentsData array

    return dashboardData ? (
        <div className='min-h-screen flex flex-col items-start justify-between gap-8 md:p-8 md:pb-0 p-4 pt-8 pb-0'>
            <div className='space-y-5 w-full'> {/* Added w-full */}
                <div className='flex flex-wrap gap-5 items-center'>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
                        <img src={assets.patients_icon} alt="Enrollments icon" /> {/* Updated alt text */}
                        <div>
                            {/* Updated to use totalEnrollments from modified API response */}
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalEnrollments !== undefined ? dashboardData.totalEnrollments : dashboardData.enrolledStudentsData.length}</p>
                            <p className='text-base text-gray-500'>Total Enrollments</p> {/* Corrected typo */}
                        </div>
                    </div>
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
                        <img src={assets.appointments_icon} alt="Courses icon" /> {/* Updated alt text */}
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{dashboardData.totalCourses}</p>
                            <p className='text-base text-gray-500'>Total Courses</p>
                        </div>
                    </div>
                    {/* --- Removed Total Earnings Card --- */}
                    {/*
                    <div className='flex items-center gap-3 shadow-card border border-blue-500 p-4 w-56 rounded-md'>
                        <img src={assets.earning_icon} alt="Earnings icon" />
                        <div>
                            <p className='text-2xl font-medium text-gray-600'>{currency}{Math.floor(dashboardData.totalEarnings)}</p>
                            <p className='text-base text-gray-500'>Total Earnings</p>
                        </div>
                    </div>
                    */}
                </div>
                <div>
                    <h2 className="pb-4 text-lg font-medium">Latest Enrollments</h2> {/* Corrected typo */}
                    <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
                        <table className="table-fixed md:table-auto w-full overflow-hidden">
                            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">#</th>
                                    <th className="px-4 py-3 font-semibold">Student Name</th>
                                    <th className="px-4 py-3 font-semibold">Course Title</th>
                                    {/* Removed Date column as purchaseDate might not be reliable */}
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-500">
                                {/* Use slice to limit displayed enrollments if needed */}
                                {dashboardData.enrolledStudentsData.slice(0, 10).map((item, index) => (
                                    <tr key={item?.student?._id || index} className="border-b border-gray-500/20"> {/* Use student ID for key */}
                                        <td className="px-4 py-3 text-center hidden sm:table-cell">{index + 1}</td>
                                        <td className="md:px-4 px-2 py-3 flex items-center space-x-3">
                                            {item.student?.imageUrl && ( // Added optional chaining
                                                <img
                                                    src={item.student.imageUrl}
                                                    alt={`${item.student?.name || 'Student'}'s profile`} // Added alt text
                                                    className="w-9 h-9 rounded-full object-cover" // Added object-cover
                                                />
                                            )}
                                            <span className="truncate">{item.student?.name || 'Unknown Student'}</span> {/* Added fallback */}
                                        </td>
                                        <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                                        {/* Removed Date cell */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                         {dashboardData.enrolledStudentsData.length === 0 && (
                            <p className='p-4 text-gray-500'>No enrollments yet.</p>
                         )}
                    </div>
                </div>
            </div>
        </div>
    ) : <Loading />;
};

export default Dashboard;