import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css';
import folderIcon from '../Assets/Images/subjectfolder.png';
import plusIcon from '../Assets/Images/plus.png'; // Plus icon for adding folders
import Resource from './Resource'; // Import your Resource component
import config from './config';

const Semester3 = () => {
    const [folders, setFolders] = useState([]);  // State to store created folders
    const [isPopupOpen, setIsPopupOpen] = useState(false);  // State for popup visibility
    const [newFolderName, setNewFolderName] = useState('');  // State for new folder name
    const [selectedFolder, setSelectedFolder] = useState(null);  // State to track selected folder
    const [errorMessage, setErrorMessage] = useState('');
    const semesterNumber = 3;  // Set the semester number for this component
    
    // Fetch folders for this semester from the database
    useEffect(() => {
        const fetchFolders = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/folders/show/${semesterNumber}`);
                setFolders(response.data);
            } catch (error) {
                console.error('There was an error fetching the folders!', error);
            }
        };

        fetchFolders();
    }, [semesterNumber]);

    // Handle folder click to show its resources
    const handleFolderClick = (folder) => {
        setSelectedFolder(folder); // Set selected folder object
    };

    const handleBackClick = () => {
        setSelectedFolder(null); // Go back to the main card view
    };
    const handleDelete = async (folderId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this folder?");
        if (confirmDelete) {
            try {
                await axios.delete(`http://localhost:5000/api/folders/deletefolder/${folderId}`); // Delete request to backend
                setFolders(folders.filter(folder => folder._id !== folderId)); // Remove deleted folder from state
            } catch (error) {
                console.error('There was an error deleting the folder!', error);
            }
        }
    };
// Add these new states for error handling

// Handle creating a new folder with validation
const handleCreateFolder = async () => {
    setErrorMessage(''); // Clear previous error messages

    // Validation checks
    if (!newFolderName) {
        setErrorMessage('Folder name cannot be empty.'); // Check for empty input
        return;
    }
    if (newFolderName.length > 30) {
        setErrorMessage('Folder name cannot exceed 30 characters.'); // Check character limit
        return;
    }
    if (/[^a-zA-Z0-9 ]/.test(newFolderName)) {
        setErrorMessage('Folder name can only contain letters, numbers, and spaces.'); // Check for invalid characters
        return;
    }

    const newFolder = { name: newFolderName, semester: semesterNumber }; // Create folder object with semester
    try {
        const response = await axios.post(`${config.BASE_API_URL}/api/folders/createfolder`, newFolder);
        setFolders([response.data, ...folders]);  // Append new folder to the list (display in front)
        setIsPopupOpen(false);  // Close the popup
        setNewFolderName('');  // Reset folder name input
    } catch (error) {
        console.error('There was an error creating the folder!', error);
    }
};

// In the return statement, display the error message above the input
return (
    <div className={styles.contentinner}>
        <h1 style={{ paddingLeft: 20 }}>Semester {semesterNumber}</h1>
        <br />
        {/* Render the list of folders */}
        {!selectedFolder ? (
            <div className={styles.cardcontainer}>
                {/* Plus symbol card for creating new folders */}
                <div className={styles.card} onClick={() => setIsPopupOpen(true)} style={{display:'flex', flexDirection:'column', justifyContent: 'center', alignItems: 'center' ,padding: '20px', cursor: 'pointer' }}>
                    <img 
                        src={plusIcon} 
                        alt="Add Folder" 
                        className={styles.cardImage} 
                        style={{marginTop: '20px', width: '130px', height: '130px', objectFit: 'cover' }} 
                    />
                    <h3 style={{paddingTop: 10}}>Create Folder</h3>
                </div>
                {/* Dynamically render created folders */}
                {folders.map(folder => (
                    <div 
                        className={styles.card} 
                        key={folder._id} 
                        style={{ cursor: 'pointer' }}
                    >
                        <div onClick={() => handleFolderClick(folder)}>
                        <img 
                            src={folderIcon} 
                            alt="Folder" 
                            className={styles.cardImage} 
                            style={{ marginTop: '20px', width: '150px', height: '130px', objectFit: 'cover' }} 
                        />
                        <h2>{folder.name}</h2>
                        </div>
                        {/* Delete button */}
                        <button 
                            onClick={() => handleDelete(folder._id)} 
                            style={{ backgroundColor: '#f44336', color: 'white', cursor: 'pointer', padding: '10px', marginTop: '10px', border: 'none', borderRadius: '5px' }}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        ) : (
            // Render Resource component when a folder is selected
            <div>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <button onClick={handleBackClick} style={{ width: 250 }}>Back to Folders</button>
                </div>
                <Resource folder={selectedFolder} /> {/* Pass selected folder to Resource */}
            </div>
        )}

        {/* Popup form for folder creation */}
        {isPopupOpen && (
            <div className={styles.popup}>
                <div className={styles.popupContent}>
                    <h2>Create New Folder</h2>
                    {/* Display error message if there is one */}
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    <input 
                        type="text" 
                        value={newFolderName} 
                        onChange={(e) => setNewFolderName(e.target.value)} 
                        placeholder="Enter folder name" 
                        className={styles.input}
                    />
                    <div className={styles.buttonContainer}>
                        <button onClick={handleCreateFolder} className={styles.createButton}>Create</button>
                        <button onClick={() => setIsPopupOpen(false)} className={styles.cancelButton}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}

export default Semester3;
