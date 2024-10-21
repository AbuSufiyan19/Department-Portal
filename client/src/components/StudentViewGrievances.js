import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; // Import the CSS module
import config from './config';

const ViewGrievances = () => {
    const [grievances, setGrievances] = useState([]);
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        // Get student ID from local storage
        const storedStudentId = localStorage.getItem('userId');
        if (storedStudentId) {
            setStudentId(storedStudentId);
        }
    }, []);
    
    useEffect(() => {
        // Fetch grievances only if studentId is available
        if (studentId) {
            axios.get(`${config.BASE_API_URL}/api/student/viewgrievances`, {
                params: { studentId }, // Send studentId as a query parameter
                withCredentials: true
            })
            .then(response => {
                setGrievances(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the grievances!', error);
            });
        }
    }, [studentId]); // Add studentId to dependency array

    return (
        <div className={styles.content}>
            <h1>View Grievances</h1>
            {grievances.length > 0 ? (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Posted Date</th>
                            <th>Response</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grievances.map(grievance => (
                            <tr key={grievance._id}>
                                <td>{grievance.title}</td>
                                <td>{grievance.description}</td>
                                <td>{new Date(grievance.postedDate).toLocaleDateString()}</td>
                                <td>{grievance.response || 'No response yet'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className={styles.empty}>No Grievances Available.</p> // Message when no grievances are present
            )}
        </div>
    );
};

export default ViewGrievances;
