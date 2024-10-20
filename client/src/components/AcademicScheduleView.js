import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; // Import the CSS module
import pdf from '../Assets/Images/pdf.png';
import config from './config';

const AcademicScheduleView = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        axios.get(`${config.BASE_API_URL}/api/admin/view-academicschedule`)
            .then(response => {
                setSchedules(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the schedules!', error);
            });
    }, []);

    // Function to delete a specific schedule
    const handleDelete = (scheduleId) => {
        if (window.confirm('Are you sure you want to delete this schedule?')) { // Confirmation dialog
            axios.delete(`${config.BASE_API_URL}/api/admin/delete-academicschedule/${scheduleId}`)
                .then(response => {
                    // Remove the deleted schedule from the state
                    setSchedules(schedules.filter(schedule => schedule._id !== scheduleId));

                    // Success alert
                    alert('Schedule deleted successfully!');
                })
                .catch(error => {
                    // Error alert
                    alert('There was an error deleting the schedule!');
                    console.error('Error:', error);
                });
        }
    };

    const openPdfInNewTab = (pdfUrl) => {
        window.open(pdfUrl, '_blank').focus();
    };

    return (
        <div className={styles.content}>
            <h1 style={{ paddingLeft: 20 }}>Academic Schedules</h1>
            <div className={styles.cardcontainer}>
                {schedules.length > 0 ? (
                    schedules.map(schedule => (
                        <div className={styles.card} key={schedule._id}>
                            <div className={styles.cardPdf}>
                                <h2>{schedule.title}</h2>
                                <p className={styles.Classgroup}>Class {schedule.group}</p>
                                <p>{schedule.semester} ({schedule.year.toString().slice(-2)}MX)</p>
                                <img 
                                    onClick={() => openPdfInNewTab(`${config.BASE_API_URL}/academic_schedules/${schedule.pdfFileName}`)} 
                                    style={{ height: 130, width: 130}} 
                                    src={pdf} 
                                    alt="PDF"
                                />
                                <br />
                                <a 
                                    href={`${config.BASE_API_URL}/academic_schedules/${schedule.pdfFileName}`} 
                                    download={schedule.pdfFileName} 
                                    style={{ color: 'blue', cursor: 'pointer', padding: '10px', textAlign: 'center', textDecoration: 'none' }}
                                >
                                    Download PDF
                                </a>

                                <br />
                                {/* Delete button */}
                                <button 
                                    onClick={() => handleDelete(schedule._id)} 
                                    style={{ backgroundColor: '#f44336', color: 'white', cursor: 'pointer', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px' }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>No academic schedules available.</p> 
                )}
            </div>
        </div>
    );
};

export default AcademicScheduleView;
