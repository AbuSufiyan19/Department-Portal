import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; // Import the CSS module
import config from './config';

const RespondGrievances = () => {
    const [grievances, setGrievances] = useState([]);

    useEffect(() => {
        // Fetch all grievances when component mounts
        axios.get(`${config.BASE_API_URL}/api/admin/viewallgrievances`, {
            withCredentials: true
        })
        .then(response => {
            setGrievances(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching the grievances!', error);
        });
    }, []);

    const handleResponseChange = (id, value) => {
        setGrievances(grievances.map(grievance =>
            grievance._id === id ? { ...grievance, response: value } : grievance
        ));
    };

    const handleRespondClick = (id) => {
        const grievance = grievances.find(g => g._id === id);
        if (grievance && grievance.response) {
            axios.post(`${config.BASE_API_URL}/api/admin/respondgrievance`, {
                grievanceId: id,
                response: grievance.response
            }, {
                withCredentials: true
            })
            .then(response => {
                // Optionally handle the response from the server
                console.log('Response updated successfully!');
                window.alert('Response updated successfully!');
            })
            .catch(error => {
                console.error('There was an error updating the response!', error);
            });
        }
    };

    return (
        <div className={styles.content}>
            <h1>Respond to Grievances</h1>
            {grievances.length === 0 ? (
                <p className={styles.empty}>No grievances available.</p> // Display message when no grievances are present
            ) : (
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Posted Date</th>
                            <th>Response</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grievances.map(grievance => (
                            <tr key={grievance._id}>
                                <td>{grievance.title}</td>
                                <td>{grievance.description}</td>
                                <td>{new Date(grievance.postedDate).toLocaleDateString()}</td>
                                <td>
                                    <textarea
                                        value={grievance.response || ''}
                                        className={styles.textarea}
                                        onChange={(e) => handleResponseChange(grievance._id, e.target.value)}
                                        rows="3"
                                        cols="30"
                                    />
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleRespondClick(grievance._id)}
                                        disabled={!grievance.response}
                                    >
                                        Respond
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default RespondGrievances;
