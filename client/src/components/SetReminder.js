import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; // Import the CSS module
import config from './config';

const SetReminder = () => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState('');
    const [group, setGroup] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [year, setYear] = useState('');   
    const [errors, setErrors] = useState({});

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSubjectChange = (e) => {
        setSubject(e.target.value);
    };

    const handleGroupChange = (e) => {
        setGroup(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!title) {
            newErrors.title = 'Please select a title';
        }

        if (!subject) {
            newErrors.subject = 'Please enter subject details';
        }

        if (!group) {
            newErrors.group = 'Please select a group';
        }

        if (!date) {
            newErrors.date = 'Please select a date';
        }

        if (!time) {
            newErrors.time = 'Please select a time';
        }

        if (!year) {
            newErrors.year = 'Please enter a year';
        } else if (!/^\d{4}$/.test(year)) { // Ensure the year is a 4-digit number
            newErrors.year = 'Please enter a valid 4-digit year';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const reminderData = {
            title,
            subject,
            group,
            date,
            time,
            year,   
        };

        axios.post(`${config.BASE_API_URL}/api/admin/set-reminder`, reminderData, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
        })
        .then(response => {
            console.log('Reminder set:', response.data);
            window.alert('Reminder set successfully!');
            setTitle('');
            setSubject('');
            setGroup('');
            setDate('');
            setTime('');
            setYear('');
            setErrors({});
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error setting the reminder!', error);
        });
    };

    return (
        <div className={styles.content}>
            <div className={styles.circularform}>
                <h1>Set Reminder</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label><br/>
                        <select value={title} onChange={handleTitleChange} required>
                            <option value="">Select Title</option>
                            <option value="CA 1">CA 1</option>
                            <option value="CA 2">CA 2</option>
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                            <option value="Lab Test 1">Lab Test 1</option>
                            <option value="Lab Test 2">Lab Test 2</option>
                            <option value="Semester Lab Exam">Semester Lab Exam</option>
                        </select>
                        {errors.title && <span className={styles.error}>{errors.title}</span>}
                    </div>
                    <div>
                        <label>Subject:</label><br/>
                        <input 
                            type="text" 
                            value={subject} 
                            onChange={handleSubjectChange} 
                            placeholder="Enter subject details" 
                            required 
                        />
                        {errors.subject && <span className={styles.error}>{errors.subject}</span>}
                    </div>
                    <div>
                        <label>Group:</label><br/>
                        <select value={group} onChange={handleGroupChange} required>
                            <option value="">Select Group</option>
                            <option value="G1">G1</option>
                            <option value="G2">G2</option>
                            <option value="G1 & G2">Both</option>
                        </select>
                        {errors.group && <span className={styles.error}>{errors.group}</span>}
                    </div>
                    <div>
                    <label>(MX)Year:</label>
                        <input 
                            type="text" 
                            value={year} 
                            onChange={handleYearChange} 
                            placeholder="Enter year (e.g., 2024)" 
                            required 
                        />
                        {errors.year && <span className={styles.error}>{errors.year}</span>}
                    </div>
                    <div>
                        <label>Date:</label><br/>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={handleDateChange}
                            onKeyDown={(e) => e.preventDefault()} 
                            required 
                        />
                        {errors.date && <span className={styles.error}>{errors.date}</span>}
                    </div>
                    <div>
                        <label>Time:</label><br/>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={handleTimeChange} 
                            required 
                        />
                        {errors.time && <span className={styles.error}>{errors.time}</span>}
                    </div>
                    <br />
                    <button type="submit">Set Reminder</button>
                </form>
            </div>
        </div>
    );
};

export default SetReminder;
