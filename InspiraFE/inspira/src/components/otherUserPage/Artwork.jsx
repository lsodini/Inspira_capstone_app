import React, { useState } from "react";
import "../../css/UCard.css";

const Artwork = ({ artwork, onMarkAsSold, role }) => {
  const [isEditing, setIsEditing] = useState(false);


  const canMarkAsSold = !artwork.sold;

  return (
    <div className="uCard-card">
      <div className="uCard-top">
        <div className="uCard-user_details">
          <div className="uCard-profile_img">
            <img
              src={artwork.user.image}
              alt="artist"
              className="uCard-cover"
            />
          </div>
          <h3>
            {artwork.user.username}
            <br />
            <span className="uCard-hour">
              {new Date(artwork.createdAt).toLocaleString()}
            </span>
            <span className="uCard-globDot">.</span>
          </h3>
        </div>
      </div>

      <h4 className="uCard-message">{artwork.title}</h4>
      <p className="uCard-description">{artwork.description}</p>
      <h5 className="uCard-price">
        Price: ${artwork.price} {artwork.sold && "(Sold)"}
      </h5>

      {artwork.mediaUrls && artwork.mediaUrls.length > 0 && (
        <div className="uCard-imgBg">
          {artwork.mediaUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`artwork-${index}`}
              className="uCard-coverFull"
            />
          ))}
        </div>
      )}

      {canMarkAsSold && (
        <div className="uCard-btns">
          <button
            className="uCard-mark-sold"
            onClick={() => onMarkAsSold(artwork.id)}
          >
            Buy
          </button>
        </div>
      )}

      <div className="uCard-border"></div>
    </div>
  );
};

export default Artwork;