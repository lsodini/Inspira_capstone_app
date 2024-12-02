import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom";

const CustomLogin = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    useEffect(() => {

    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:3001/auth/login"; 
      
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          });
      
          if (!response.ok) {
            throw new Error("Errore nella fetch!");
          }
      
          const data = await response.json();
          console.log("I tuoi dati", 
            data);
      

          localStorage.setItem("Access Token", data.accessToken);
          navigate("/homepage")

      
        } catch (err) {
          console.log("Errore durante il login", err);
        }
      };


    return (
        <>
            <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
                <Row className="w-100 d-flex justify-content-center">
                    <Col lg={4} className="card-login">
                        <div className="d-flex align-items-center justify-content-center py-4">
                            <h4 style={{ fontWeight: "300" }} className="text-light m-0"> Benvenuto su Inspira!</h4>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <p style={{ fontWeight: "300" }} className="text-light">Esplora il mondo dell'arte e appassionati.</p>
                        </div>
                      
                        <form className="py-3" onSubmit={handleSubmit}>
                            <div data-mdb-input-init className="py-2 px-3">
                                <input placeholder="Inserisci email"
                                    type="email"
                                    id="form2Example1"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input" />
                            </div>
                            <div data-mdb-input-init className="py-2 px-3">
                                <input placeholder="Inserisci password"
                                    type="password"
                                    id="form2Example2"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="form-input" />
                            </div>
                            <div className="py-2 px-2 d-flex align-items-center justify-content-center">
                                <Link to="/resetPasswordPage" className="reset-password">
                                    <p>Hai dimenticato la password?</p>
                                </Link>
                            </div>

                            <div className="py-2 d-flex align-items-center justify-content-center">
                                <button data-mdb-button-init data-mdb-ripple-init className="custom-button" type="submit">Sign in</button>
                            </div>


                            <div className="text-center py-2 d-flex align-items-center justify-content-center">
                                <div className="px-1">
                                    <p style={{ opacity: "0.6" }} className="text-light">Non sei ancora dei nostri?</p>
                                </div>
                                <div className="px-1">
                                    <Link to="/register" className="register-link">
                                        <p> Registrati.</p>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default CustomLogin;