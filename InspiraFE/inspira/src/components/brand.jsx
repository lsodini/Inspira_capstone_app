import React from 'react';

const Brand = () => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="d-flex align-items-center">
        <a className="navbar-brand" href="/" style={{ display: 'flex', alignItems: 'center', marginRight: '150px' }}>
          <img
            src="/images/logo.webp"
            alt="Logo"
            style={{ maxHeight: '400px', marginRight: '-110px' }} 
          />
          <h1 style={{ fontSize:'10rem'}}>
            I<span className="primary">n</span>spira
          </h1>
        </a>
      </div>
    </div>
  );
};

export default Brand;
