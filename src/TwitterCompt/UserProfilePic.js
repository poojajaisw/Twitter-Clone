import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { useUser } from './UserToken';

const UserProfile = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const { userToken } = useUser(); 

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/profile', {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userToken]);

  const handleImageChange = (e) => {
    setProfilePic(e.target.files[0]);
  };

  const handleEditProfileClick = () => {
    setEditMode(true);
  };

  const handleProfilePicSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('profilePic', profilePic);

      await axios.post('http://localhost:8080/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
      });

      // fetch api for profilPic
      const response = await axios.get('http://localhost:8080/profile', {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error('Error updating profile picture:', error);
    }
  };

  return (
    <div>
      
      {user && (
        <div>
          <img src={`data:image/jpg;base64,${user.profilePic}`} className = "pro shadow-lg p-2 mb-2 bg-body" alt="Profile Pic" style={{ width: '130px', height: '130px', borderRadius: '50%' }} onClick={handleEditProfileClick} />
          <p><strong>{user.userName}</strong>
           <br /> 
          <strong>Location : <FontAwesomeIcon icon={faLocation} /> {user.location}</strong>
          <br />
          <strong>DOB :{user.dob}</strong>
          </p>
        
        </div>
      )}
      {editMode ? (
      <form onSubmit={handleProfilePicSubmit}>
        <label>Profile Picture:</label>
        <input type="file" onChange={handleImageChange} />
        <button type="submit">Upload Profile Picture</button>
      </form>
      ) : (
        <button onClick={handleEditProfileClick} className='profile' style={{border:'none'}} >Edit Profile</button>
      )}
    </div>
  );
};

export default UserProfile;

