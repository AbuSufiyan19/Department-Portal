import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../css/index.module.css'; // Import the CSS module
import config from './config';

const Dashboard = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        axios.get(`${config.BASE_API_URL}/api/admin/circulars`)
            .then(response => {
                setCards(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the circulars!', error);
            });
    }, []);

    const openImageInNewTab = (imageUrl) => {
        window.open(imageUrl, '_blank').focus();
    };

    return (
        <div className={styles.content}> {/* Use styles object */}
            <h1 style={{ paddingLeft: 20 }}>Dashboard</h1>
            <br />
            <div className={styles.cardcontainer}> {/* Use styles object */}
                {cards.length > 0 ? (
                    cards.map(card => (
                        <div className={styles.card} key={card._id}> {/* Use styles object */}
                            <img 
                                src={`${config.BASE_API_URL}/${card.image}`} 
                                alt={card.title} 
                                className={styles.cardImage} 
                                onClick={() => openImageInNewTab(`${config.BASE_API_URL}/${card.image}`)} // Add onClick event
                                style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate clickability
                            />
                            <h2>{card.title}</h2>
                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>No circulars available.</p> // Message to show when no circulars are present
                )}
            </div>
        </div>
    );
}

export default Dashboard;
