import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; 
import config from './config';

const AcademicSchedulePosting = () => {
    const [group, setGroup] = useState('');
    const [semester, setSemester] = useState('');
    const [pdf, setPdf] = useState(null);
    const [year, setYear] = useState(''); 
    const [errors, setErrors] = useState({});

    const handleGroupChange = (e) => {
        setGroup(e.target.value);
    };

    const handleSemesterChange = (e) => {
        setSemester(e.target.value);
    };

    const handlePdfChange = (e) => {
        setPdf(e.target.files[0]);
    };

    const handleYearChange = (e) => {
        setYear(e.target.value);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!group) {
            newErrors.group = 'Please select a group';
        }

        if (!semester) {
            newErrors.semester = 'Please select a semester';
        }

        if (!pdf) {
            newErrors.pdf = 'Please upload a PDF file';
        } else if (pdf.type !== 'application/pdf') {
            newErrors.pdf = 'The uploaded file must be a PDF';
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

        const formData = new FormData();
        formData.append('group', group);
        formData.append('semester', semester);
        formData.append('pdf', pdf);
        formData.append('year', year); // Append the year to the form data

        axios.post(`${config.BASE_API_URL}/api/admin/upload-academicschedule`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true
        })
        .then(response => {
            console.log('PDF uploaded:', response.data);
            window.alert('PDF uploaded successfully!');
            setGroup('');
            setSemester('');
            setPdf(null);
            setYear(''); // Reset year
            setErrors({});
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error uploading the PDF!', error);
        });
    };

    return (
        <div className={styles.content}>
            <div className={styles.circularform}>
                <h1>Upload Academic Schedule</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Group:</label><br/>
                        <select value={group} onChange={handleGroupChange} required>
                            <option value="">Select Group</option>
                            <option value="G1">G1</option>
                            <option value="G2">G2</option>
                        </select>
                        {errors.group && <span className={styles.error}>{errors.group}</span>}
                    </div>
                    <div>
                        <label>Semester:</label><br/>
                        <select value={semester} onChange={handleSemesterChange} required>
                            <option value="">Select Semester</option>
                            <option value="Semester 1">Semester 1</option>
                            <option value="Semester 2">Semester 2</option>
                            <option value="Semester 3">Semester 3</option>
                            <option value="Semester 4">Semester 4</option>
                        </select>
                        {errors.semester && <span className={styles.error}>{errors.semester}</span>}
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
                        <label>PDF:</label>
                        <input type="file" onChange={handlePdfChange} accept="application/pdf" required />
                        {errors.pdf && <span className={styles.error}>{errors.pdf}</span>}
                    </div>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default AcademicSchedulePosting;
