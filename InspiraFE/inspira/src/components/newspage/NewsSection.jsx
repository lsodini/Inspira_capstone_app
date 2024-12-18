import React, { useState, useEffect } from 'react';


const getNews = async (query) => {
  const API_KEY = 'c1f1bab06ff34beba6f6c17001e5f71d'; 
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=${query}&language=it&apiKey=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Errore nel recupero delle notizie');
  }

  const data = await response.json();
  return data.articles;
};

const NewsSection = () => {
  
  const [exhibitions, setExhibitions] = useState([]);
  const [contemporaryArt, setContemporaryArt] = useState([]);
  const [artEvents, setArtEvents] = useState([]);
  const [techArt, setTechArt] = useState([]);
  const [artMarket, setArtMarket] = useState([]);
  const [photoArt, setPhotoArt] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSection, setSelectedSection] = useState('exhibitions');

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        
        const exhibitionsData = await getNews('mostre d\'arte');
        const contemporaryArtData = await getNews('arte contemporanea');
        const artEventsData = await getNews('eventi artistici in corso');
        const techArtData = await getNews('arte e tecnologia');
        const artMarketData = await getNews('mercato dell\'arte');
        const photoArtData = await getNews('fotografia artistica');

        setExhibitions(exhibitionsData);
        setContemporaryArt(contemporaryArtData);
        setArtEvents(artEventsData);
        setTechArt(techArtData);
        setArtMarket(artMarketData);
        setPhotoArt(photoArtData);
      } catch (err) {
        setError('Errore nel recupero delle notizie');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="loading-container ">
        <img src="/images/logo.webp" alt="Caricamento" className="loading-logo" />
      </div>
    );
  }

  if (error) {
    return <div className="error-container ">{error}</div>;
  }

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const renderNews = () => {
    const sectionData = {
      exhibitions,
      contemporaryArt,
      artEvents,
      techArt,
      artMarket,
      photoArt,
    };

    const articles = sectionData[selectedSection] || [];

    return (
      <ul className="news-list">
        {articles.length === 0 ? (
          <li>Nessuna notizia trovata.</li>
        ) : (
          articles.map((article, index) => (
            <li key={index} className="news-item">
              <div className='news-text'>
              <h3>{article.title}</h3>
              <p>{article.description || 'Descrizione non disponibile'}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Leggi l'articolo completo
              </a>
              </div>
              {article.urlToImage && (
                <img src={article.urlToImage} alt={article.title} className="news-image" />
              )}
            </li>
          ))
        )}
      </ul>
    );
  };

  const sectionTitles = {
    exhibitions: "Ultime Mostre d'Arte",
    contemporaryArt: "Arte Contemporanea",
    artEvents: "Eventi Artistici in Corso",
    techArt: "Arte e Tecnologia",
    artMarket: "Mercato dell'Arte",
    photoArt: "Fotografia Artistica",
  };

  return (
    <div className="news-section ">
      <div className="section-menu">
        {Object.keys(sectionTitles).map((section) => (
          <button key={section} onClick={() => handleSectionChange(section)}>
            {sectionTitles[section]}
          </button>
        ))}
      </div>

      <h2>{sectionTitles[selectedSection]}</h2>

      {renderNews()}
    </div>
  );
};

export default NewsSection;
