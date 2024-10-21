import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; 
import pdfIcon from '../Assets/Images/pdf.png'; // Icon for PDFs
import plusIcon from '../Assets/Images/plus.png'; // Plus icon for adding PDFs
import config from './config';

const Resource = ({ folder }) => { // Accept folder prop
    const [resources, setResources] = useState([]); // State to store resources
    const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility
    const [newResourceName, setNewResourceName] = useState(''); // State for new resource name
    const [selectedFile, setSelectedFile] = useState(null); // State for selected file
    const [error, setError] = useState(''); // State for error messages

    // Fetch resources for this folder from the database
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get(`${config.BASE_API_URL}/api/resources/${folder._id}`); // Fetch resources based on folder ID
                setResources(response.data);
            } catch (error) {
                console.error('There was an error fetching the resources!', error);
            }
        };

        fetchResources();
    }, [folder]);

    // Handle file selection
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Set the selected file
    };

    const openImageInNewTab = (imageUrl) => {
        window.open(imageUrl, '_blank').focus();
    };

    // Handle deleting a resource
    const handleDelete = async (resourceId) => {
        // Show confirmation prompt
        const confirmed = window.confirm("Are you sure you want to delete this resource?");
        
        if (confirmed) {
            try {
                await axios.delete(`${config.BASE_API_URL}/api/resources/deleteresource/${resourceId}`); // Send DELETE request to backend
                setResources(resources.filter(resource => resource._id !== resourceId)); // Update state to remove deleted resource
            } catch (error) {
                console.error('There was an error deleting the resource!', error);
            }
        }
    };

    // Handle creating a new resource
    const handleCreateResource = async () => {
        // Reset error messages
        setError('');

        // Validation: Check if resource name and file are provided
        if (!newResourceName) {
            setError('Resource name is required.');
            return;
        }

        if (!selectedFile || selectedFile.type !== 'application/pdf') {
            setError('Please upload a valid PDF file.');
            return;
        }

        const formData = new FormData(); // Create form data
        formData.append('name', newResourceName); // Append resource name
        formData.append('file', selectedFile); // Append selected file
        formData.append('folderId', folder._id); // Append folder ID
        formData.append('semesterNumber', folder.semester); // Append semester number

        try {
            const response = await axios.post(`${config.BASE_API_URL}/api/resources/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Set content type for file upload
                }
            });
            setResources([response.data, ...resources]); // Append new resource to the list (display in front)
            setIsPopupOpen(false); // Close the popup
            setNewResourceName(''); // Reset resource name input
            setSelectedFile(null); // Reset selected file
        } catch (error) {
            console.error('There was an error uploading the resource!', error);
        }
    };

    return (
        <div className={styles.contentinner}>
            <h1 style={{ paddingLeft: 20 }}>Resources</h1>
            <br />
            <div className={styles.cardcontainer}>
                {/* Plus symbol card for uploading new PDFs */}
                <div className={styles.card} onClick={() => setIsPopupOpen(true)} style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center', padding: '20px', cursor: 'pointer' }}>
                    <img 
                        src={plusIcon} 
                        alt="Add File" 
                        className={styles.cardImage} 
                        style={{ marginTop: '20px', width: '80px', height: '80px', objectFit: 'cover' }} 
                    />
                    <h3 style={{paddingTop: 10}}>Add File</h3>
                </div>
                {/* Dynamically render created PDF resources */}
                {resources.map(resource => (
                    <div 
                        className={styles.card} 
                        key={resource._id} 
                        style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickable
                    >
                        <div onClick={() => openImageInNewTab(`${config.BASE_API_URL}/${resource.url}`)}>
                            <img 
                                src={pdfIcon} 
                                alt="PDF" 
                                className={styles.cardImage} 
                                style={{ marginTop: '10px', width: '90px', height: '90px', objectFit: 'cover' }} 
                            />
                            <h2>{resource.name}</h2>
                        </div>
                        {/* Delete button */}
                        <button 
                            onClick={() => handleDelete(resource._id)} 
                            style={{ backgroundColor: 'white', color: 'red', paddingTop: '0px', cursor: 'pointer', padding: '5px', border: '3px solid red', borderRadius: '50px', width:'90px', fontWeight:'bold' }}
                            >
                            Delete
                        </button>
                    </div>
                ))}

                
            </div>

            {/* Popup form for resource creation (upload PDF) */}
            {isPopupOpen && (
                <div className={styles.popup}>
                    <div className={styles.popupContent}>
                        <h2>Upload New Resource</h2>
                        <input 
                            type="text" 
                            value={newResourceName} 
                            onChange={(e) => setNewResourceName(e.target.value)} 
                            placeholder="Enter resource name" 
                            className={styles.input}
                        />
                        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="application/pdf"
                            className={styles.input}
                        />
                        <div className={styles.buttonContainer}>
                            <button onClick={handleCreateResource} className={styles.createButton}>Upload</button>
                            <button onClick={() => setIsPopupOpen(false)} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Resource;
