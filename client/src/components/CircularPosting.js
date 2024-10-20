import React, { useState } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css';
import config from './config';

const CircularPosting = () => {
    const [title, setTitle] = useState('');
    const [image, setImage] = useState(null);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if the file is an image
            if (file.type.startsWith('image/')) {
                setImage(file);
            } else {
                window.alert('Please upload a valid image file.');
                e.target.value = null; // Reset the file input
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!image) {
            window.alert('Please select an image to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('image', image);

        axios.post(`${config.BASE_API_URL}/api/admin/circulars`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        })
        .then(response => {
            console.log('Circular saved:', response.data);
            window.alert('Circular posted successfully!');
            setTitle('');
            setImage(null);
            window.location.reload();
        })
        .catch(error => {
            console.error('There was an error saving the circular!', error);
        });
    };

    return (
        <div className={styles.content}>
            <div className={styles.circularform}>
                <h1>Post Announcements</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={handleTitleChange} 
                            required 
                            placeholder="Enter Announcement Title Here"
                        />
                    </div>
                    <div>
                        <label>Image:</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            required
                        />
                    </div>
                    <br />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default CircularPosting;
