import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; // Import the CSS module
import config from './config';

const GrievancePosting = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [studentId, setStudentId] = useState('');

    useEffect(() => {
        // Get student ID from local storage
        const storedStudentId = localStorage.getItem('userId');
        if (storedStudentId) {
            setStudentId(storedStudentId);
        }
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const grievanceData = {
            title,
            description,
            studentId
        };

        axios.post(`${config.BASE_API_URL}/api/student/postgrievances`, grievanceData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
        .then(response => {
            console.log('Grievance saved:', response.data);
            window.alert('Grievance posted successfully!');
            setTitle('');
            setDescription('');
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error saving the grievance!', error);
        });
    };

    return (
        <div className={styles.content}>
            <div className={styles.circularform}>
                <h1>Post Grievance</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={title} onChange={handleTitleChange} placeholder="Enter Grievance Title Here" required />
                    </div>
                    <div>
                        <label>Description:</label><br />
                        <textarea value={description} className={styles.textarea} onChange={handleDescriptionChange} rows="3" cols="40" placeholder="Enter Description" required />
                    </div>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default GrievancePosting;
