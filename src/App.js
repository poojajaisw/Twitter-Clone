// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './twitterPage/Login';
import UserPage from './twitterPage/UserPage';
import TweetForm from './twitterPage/TweetForm';
import ProfilePage from './twitterPage/ProfilePage'

const App = () => {
  

  return (
    <>
      <Router>
        <Login />
        <Routes>
       
        
        
          <Route path="/register" element={<UserPage />} />
          <Route path="/tweet" element={<TweetForm />} />
          <Route path="/profile" element={<ProfilePage />} />
          
         
        
        
        </Routes>
      </Router>
    </>
  );
};

export default App;
