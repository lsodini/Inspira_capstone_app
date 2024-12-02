import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    return (
        <>
            <Container fluid className="vh-100 d-flex align-items-center justify-content-center">
                <Row className="w-100 d-flex justify-content-center">
                    <Col lg={6} className="card-login">
                        <div className="d-flex align-items-center justify-content-center py-4">
                            <h4 style={{ fontWeight: "300" }} className="text-light m-0"> Registrati!</h4>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                            <p style={{ fontWeight: "300" }} className="text-light"> Metti qui i tuoi dati, ci teniamo alla tua privacy.</p>
                        </div>
                        <form className="py-3">
                            <div data-mdb-input-init class="py-2 px-3">
                                <input placeholder="Nome" type="text" id="form2Example1" class="form-input" />
                            </div>
                            <div data-mdb-input-init class="py-2 px-3">
                                <input placeholder="Cognome" type="text" id="form2Example1" class="form-input" />
                            </div>
                            <div data-mdb-input-init class="py-2 px-3">
                                <input placeholder="Username" type="text" id="form2Example1" class="form-input" />
                            </div>
                            <div data-mdb-input-init class="py-2 px-3">
                                <input placeholder="Email" type="text" id="form2Example1" class="form-input" />
                            </div>
                            <div data-mdb-input-init class="py-2 px-3">
                                <input placeholder="Password" type="password" id="form2Example2" class="form-input" />
                            </div>
                            <div className="py-3 d-flex align-items-center justify-content-center">
                                <div className="px-3">
                                    <button data-mdb-button-init data-mdb-ripple-init class="custom-button"> Register</button>
                                </div>
                                <div className="px-3">
                                    <button data-mdb-button-init data-mdb-ripple-init class="custom-button"> Clear Form</button>
                                </div>
                            </div>


                            <div class="text-center py-2 d-flex align-items-center justify-content-center">
                                <div className="px-2">
                                    <Link to="/" className="backhome-link">
                                        <p className="text-light">Go back to the login page.</p>
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

export default RegisterPage;