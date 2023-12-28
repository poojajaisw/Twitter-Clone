import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useUser } from '../TwitterCompt/UserToken'; 


function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const navigate = useNavigate();
  const { loginUser } = useUser(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Sending a POST request to your backend to login the user
    try {
      const response = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        loginUser(data.token); 
        setIsSubmitted(true);
    
        //Navigating on user profile file 
        navigate('/profile');
      } else {
        setIsSubmitted(false);
        setLoginError('Invalid email or password'); 
      
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const location = useLocation();

  

  const isProfilePage = location.pathname === '/profile';

  if (isProfilePage) {
    return null;
  }

  const isTweetPage = location.pathname === '/tweet';

  if (isTweetPage) {
    return null;
  }

  const isRegister = location.pathname === '/register';

  if (isRegister) {
    return null;
  }

  const isFollow = location.pathname === '/follow';

  if (isFollow) {
    return null;
  }
  

  return (
    <>
      <div className="container" style={{marginTop:'20%'}}>
        <div className="row">
          <div className="col"></div>
          <div className="Twitter shadow-lg  " style={{ width:'25%', height:'380px', backgroundColor:'blue',borderRadius:'5%'}} >
            <h3 className="text shadow-lg p-1 mb-2 bg-body" style={{width:'110px',height:'110px', borderRadius:'50%', textAlign:'center' , marginTop:'40%', marginLeft:'32%'}} >Join <br /> Us 
            <br />  <FontAwesomeIcon icon={faTwitter} /></h3>
            
          </div>
          <div className="col2">
            <div className="Login shadow-lg p-3 mb-16" style={{borderRadius:'5%'}}>
              <h2 className="text-center text-uppercase pt-4 shadow-lg p-3 mb-2">Login </h2>
              {loginError && (
                <div className="error-alert text-center text-uppercase pt-4">{loginError}</div>
              )}
              {isSubmitted ? (
                <div className="success-alert text-center text-uppercase pt-4 shadow-lg p-3 mb-16">Login successful!</div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="product" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control wider-input"
                      id=""
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputs}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control wider-input "
                      id=""
                      required
                      name="password"
                      value={formData.password}
                      onChange={handleInputs}
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary shadow-lg p-3 mb-16" style={{fontWeight:'bold'}}>
                      Submit
                    </button>
                  </div>
                </form>
              )}
              <p className="register">
                New User register here/
                <Link to="/register" className="nav-linkr">
                  {' '}
                  register{' '}
                </Link>
              </p>
            </div>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </>
  );
}

export default Login;
