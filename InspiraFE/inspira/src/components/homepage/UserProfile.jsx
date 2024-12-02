import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";

const UserProfileComponent = () => {
    const [userProfile, setUserProfile] = useState({});
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('Access Token');
            if (!token) {
                console.log("Token mancante");
                return;
            }
    
            try {
                const response = await fetch('http://localhost:3001/api/utenti/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                if (!response.ok) {
                    throw new Error('Errore nel recupero del profilo');
                }
    
                const data = await response.json();
                if (data && data.user) {
                    setUserProfile(data.user);
                } else {
                    console.log("Dati utente non validi", data);
                }
            } catch (err) {
                console.log("Errore nel caricamento del profilo", err);
            }
        };
    
        fetchUserProfile();
    }, []);


    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/utenti/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, surname }),
            });
            const data = await response.json();
            setUserProfile(data.user);
        } catch (err) {
            console.log("Errore nell'aggiornamento del profilo", err);
        }
    };

    return (
        <div>
            <h3>Profilo Utente</h3>
            <div>
                <p>Nome: {userProfile.name}</p>
                <p>Cognome: {userProfile.surname}</p>
                <form onSubmit={handleUpdateProfile}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Modifica nome"
                    />
                    <input
                        type="text"
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        placeholder="Modifica cognome"
                    />
                    <button type="submit">Aggiorna Profilo</button>
                </form>
            </div>
        </div>
    );
};

export default UserProfileComponent;
