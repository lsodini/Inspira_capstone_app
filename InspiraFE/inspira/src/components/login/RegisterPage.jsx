import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:3001/auth/register";
        
        const userData = { name, surname, username, email, password };
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error("Errore durante la registrazione");
            }

            const data = await response.json();
            console.log("Registrazione riuscita:", data);
            navigate("/");

        } catch (err) {
            console.log("Errore nella registrazione", err);
        }
    };

    return (
        <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
            <Row className="w-100 d-flex justify-content-center">
                <Col lg={6} className="card-login">
                    <div className="d-flex align-items-center justify-content-center py-4">
                        <h4 style={{ fontWeight: "300" }} className="text-light m-0">Unisciti alla community di Inspira!</h4>
                    </div>
                    <div className="d-flex align-items-center justify-content-center">
                        <p style={{ fontWeight: "300" }} className="text-light">Crea il tuo profilo e inizia a condividere la tua arte con il mondo!</p>
                    </div>
                    <form onSubmit={handleSubmit} className="py-3">
                        <div data-mdb-input-init className="py-2 px-3">
                            <input
                                placeholder="Nome"
                                type="text"
                                id="Nome"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div data-mdb-input-init className="py-2 px-3">
                            <input
                                placeholder="Cognome"
                                type="text"
                                id="Cognome"
                                className="form-input"
                                value={surname}
                                onChange={(e) => setSurname(e.target.value)}
                            />
                        </div>
                        <div data-mdb-input-init className="py-2 px-3">
                            <input
                                placeholder="Username"
                                type="text"
                                id="Username"
                                className="form-input"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div data-mdb-input-init className="py-2 px-3">
                            <input
                                placeholder="Email"
                                type="email"
                                id="Email"
                                className="form-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div data-mdb-input-init className="py-2 px-3">
                            <input
                                placeholder="Password"
                                type="password"
                                id="Password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="py-3 d-flex align-items-center justify-content-center">
                            <div className="px-3">
                                <button
                                    data-mdb-button-init
                                    data-mdb-ripple-init
                                    className="custom-button"
                                    type="submit"
                                >
                                    Registrati
                                </button>
                            </div>
                            <div className="px-3">
                                <button
                                    type="button"
                                    data-mdb-button-init
                                    data-mdb-ripple-init
                                    className="custom-button"
                                    onClick={() => {
                                        setName('');
                                        setSurname('');
                                        setUsername('');
                                        setEmail('');
                                        setPassword('');
                                    }}
                                >
                                    Clear Form
                                </button>
                            </div>
                        </div>

                        <div className="text-center py-2 d-flex align-items-center justify-content-center">
                            <div className="px-2">
                                <Link to="/" className="backhome-link">
                                    <p className="text-light">Hai già un account? Accedi qui.</p>
                                </Link>
                            </div>
                        </div>
                    </form>
                </Col>
            </Row>
        </Container>
    );
};

export default RegisterPage;
