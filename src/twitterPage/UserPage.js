import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useNavigate } from 'react-router-dom';
import './CSSFile.css';


const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    userName: '',
    email: '',
    Password: '',
    profilePic: '',
    location: '',
    dob: '',
    followers: [],
    following: [],
  });
 
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:8080/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      navigate('/login');
  };

  return (

    <div className="container" style={{ marginLeft: '30%',marginTop:'3%' }}>
    <div className="row">
      <div className="col"></div>
    
      </div>

      <div className="col2">
        <div className="googlefont-bg-light">
          <h2 className="text-center text-uppercase pt-4">Registation Form   <FontAwesomeIcon icon={faTwitter} /> </h2>

          <form onSubmit={handleSubmit}>

          <div className="mb-3">
          <label htmlFor="product" className="form-label">Name</label>
          <input type="text" className="form-control wider-input"  id="" required name="name"  value={formData.name} onChange={handleChange}  />
           </div>

           <div className="mb-3">
          <label htmlFor="product" className="form-label">User Name </label>
          <input type="text" className="form-control wider-input"  id="" required name="userName"  value={formData.userName} onChange={handleChange}  />
           </div>

           <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control wider-input"  id="" required name="email"  value={formData.email} onChange={handleChange} />
           </div>

           <div className="mb-3">
          <label htmlFor="product" className="form-label">Password</label>
          <input type="password" className="form-control wider-input"  id="" required name="Password"  value={formData.Password} onChange={handleChange}  />
           </div>
        
           <div className="mb-3">
          <label htmlFor="product" className="form-label">Location</label>
          <input type="text" className="form-control wider-input"  id="" required name="location"  value={formData.location} onChange={handleChange} />
           </div>

           <div className="mb-3">
          <label htmlFor="product" className="form-label">DOB</label>
          <input type="date" className="form-control wider-input"  id="" required name="dob"  value={formData.dob} onChange={handleChange}  />
           </div>
           <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Submit</button></div>
          </form>
         
    </div>
    </div>
    </div>
  
    
  );
};

export default SignupForm;
