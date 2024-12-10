import React from 'react';

const ArtworkCard = ({ artwork }) => {
  return (
    <div className="artwork-card">
      <h3>{artwork.title}</h3>
      <p>{artwork.description}</p>
      {artwork.mediaUrl && <img src={artwork.mediaUrl} alt="Artwork Media" />}
      <p><small>Created by: {artwork.user}</small></p>
      <p><small>Price: ${artwork.price}</small></p>
      <p><small>Created at: {new Date(artwork.createdAt).toLocaleString()}</small></p>
    </div>
  );
};

export default ArtworkCard;
