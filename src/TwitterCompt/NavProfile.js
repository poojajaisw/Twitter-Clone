

import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import UserProfilePic from './UserProfilePic'

const Header = () => {
  
  return (
    <nav className="navbar navbar-expand-lg navbar-blue bg-blue shadow-lg p-1 mb-2 bg-body">
      <div className="container-fluid">
        <div className='row'>
         <UserProfilePic /> 
        </div>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarScroll"
        aria-controls="navbarScroll"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarScroll">
        <ul className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll" style={{ '--bs-scroll-height': '100px' }}>
          <li className="nav-item">
            <Link className="nav-link" to="/tweet">
              <FontAwesomeIcon className="icon shadow-lg p-2 mb-2 bg-body" size="4x" style={{ width: "50px", height: "50px", borderRadius:'50%', marginLeft: "50px" }} icon={faHome} />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/profile">
              <FontAwesomeIcon className="icon shadow-lg p-2 mb-2 bg-body" size="4x" style={{ width: "50px",height: "50px", borderRadius:'50%', marginLeft: "50px" }} icon={faUser} />
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/register">
              <FontAwesomeIcon className="icon shadow-lg p-2 mb-2 bg-body" size="4x" style={{ width: "50px", height: "50px", borderRadius:'50%', marginLeft: "50px" }} icon={faTwitter} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
