import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter} from '@fortawesome/free-brands-svg-icons';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';


const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/search?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchClick = () => {
    if (searchQuery) {
      fetchData();
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchClick();
    }
  };

  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return null;
  }

  const isRegisterPage = location.pathname === '/register';

  if (isRegisterPage) {
    return null;
  }

  const isContactPage = location.pathname === '/contact';
  if (isContactPage) {
    return null;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-blue bg-blue  shadow-lg p-3 mb-2 bg-body">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/login" style={{fontSize:'30px', fontWeight:'bold'}}>
            Twitter
          </Link>
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
              <form className="d-flex">
                <input
                  className="form-control me-2 shadow-lg p-2 mb-2 bg-body" style={{marginLeft:"40%", width:"850px"}}
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={handleKeyPress}
                />
                <button className="btn btn-outline-success shadow-lg p-2 mb-2 bg-body" onClick={handleSearchClick} type="submit">
                  Search
                </button>
              </form>

              <li className="nav-item">
                <Link className="nav-link  " style={{fontSize :"20px", fontWeight:"bold", marginLeft:'50%'}} to="/login">
                  Login 
                </Link>
              </li>

             
              <li className="nav-item">
                <Link className="nav-link" to="/tweet">
                  <FontAwesomeIcon className="icon shadow-lg p-2 mb-2 bg-body"  size="4x" style={{width:"30px" ,height: "30px", borderRadius:'50%', marginLeft:"65px"}} icon={faHome} />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  <FontAwesomeIcon className="icon shadow-lg p-2 mb-2 bg-body"  size="4x" style={{width:"30px" ,height: "30px", borderRadius:'50%', marginLeft:"50px"}} icon={faUser} />
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  <FontAwesomeIcon className="icon shadow-lg p-2 mb-2 bg-body"  size="4x" style={{width:"30px" ,height: "30px", borderRadius:'50%', marginLeft:"50px"}} icon={faTwitter} />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ul className='CartUl' style={{ listStyleType: 'none', padding: 0 }}>
        {searchResults.map((result) => (
          <li className='CartLi' key={result._id}>
            {result.name}
            <img src={result.imageUrl} alt={result.name} className='search-img' />
            <h3 className='result'>{result.name}</h3>
            <p>${result.price}</p>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Header;

