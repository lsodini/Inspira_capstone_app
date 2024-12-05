import React from 'react';
import '../../css/UserCard.css'; // Importa il CSS

const UserCard = () => {
  return (
    <div className="profile-card">
      <div className="profile-card__content">
        <div className="profile-card__img">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="profile-card__details">
          <h2 className="profile-card__name">John Doe</h2>
          <p className="profile-card__username">@johndoe</p>
          <p className="profile-card__bio">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="profile-card__stats">
            <div className="profile-card__stat">
              <strong>Followers</strong>
              <p>1200</p>
            </div>
            <div className="profile-card__stat">
              <strong>Followed</strong>
              <p>300</p>
            </div>
            <div className="profile-card__stat">
              <strong>Posts</strong>
              <p>58</p>
            </div>
            <div className="profile-card__stat">
              <strong>Artwork</strong>
              <p>24</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
