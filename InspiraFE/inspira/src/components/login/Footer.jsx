import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer className="py-4 ">
            <div className="custom-container">
                <Row className="align-items-center">
                   
                    <Col md={6} className="text-start mb-2">
                        <h5>Inspira</h5>
                        <p>
                            Unisciti alla community di artisti e appassionati. Condividi la tua arte e scopri quella degli altri.
                        </p>
                    </Col>

                    
                    <Col md={6} className="text-end mb-2">
                        <h5>Seguici su</h5>
                        <div className="d-flex justify-content-end align-items-center">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark mx-2"
                            >
                                <FaFacebook size={30} />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark mx-2"
                            >
                                <FaInstagram size={30} />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark mx-2"
                            >
                                <FaTwitter size={30} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark mx-2"
                            >
                                <FaLinkedin size={30} />
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-dark mx-2"
                            >
                                <FaGithub size={30} />
                            </a>
                        </div>
                    </Col>
                </Row>

                
                <Row>
                    <Col md={12} className="text-end mt-4">
                        <p className="mb-0">&copy; 2024 Inspira - Tutti i diritti riservati</p>
                    </Col>
                </Row>
            </div>
        </footer>
    );
};

export default Footer;
