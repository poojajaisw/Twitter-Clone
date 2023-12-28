import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../TwitterCompt/UserToken';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import NavProfile from '../TwitterCompt/NavProfile'



const TweetComponent = () => {

  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [following, setFollowing] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  

  const { userToken } = useUser(); 

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTweetSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', image);

      const response = await axios.post('http://localhost:8080/tweets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userToken}`,
        },
      });

      setTweets((prevTweets) => [response.data, ...prevTweets]);
      setContent('');
      setImage(null);
    } catch (error) {
      console.error('Error creating tweet:', error);
    }
  };
  const handleLike = async (tweetId) => {
    try {
      const isLiked = likedTweets.includes(tweetId);

      if (isLiked) {

      //for dislike fetch api

        await axios.post(`http://localhost:8080/tweets/${tweetId}/dislike`, null, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setTweets((prevTweets) =>
          prevTweets.map((tweet) =>
            tweet._id === tweetId
              ? {
                ...tweet,
                likes: tweet.likes.filter((like) => like.userId !== 'CURRENT_USER_ID'),
              }
              : tweet
          )
        );

        setLikedTweets((prevLikedTweets) => prevLikedTweets.filter((likedId) => likedId !== tweetId));
      } else {

        // If not liked, handle like
        await axios.post(`http://localhost:8080/tweets/${tweetId}/like`, null, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        });

        setTweets((prevTweets) =>
          prevTweets.map((tweet) =>
            tweet._id === tweetId
              ? {
                ...tweet,
                likes: [...tweet.likes, { userId: 'CURRENT_USER_ID', username: 'CURRENT_USER_NAME' }],
              }
              : tweet
          )
        );

        setLikedTweets((prevLikedTweets) => [...prevLikedTweets, tweetId]);
      }
    } catch (error) {
      console.error('Error liking/disliking tweet:', error);
    }
  };


  const handleUpdate = async (tweetId) => {
    try {
      // Placeholder for updating a tweet
      const updatedContent = prompt('Enter updated content:');
      const response = await axios.put(`http://localhost:8080/tweets/${tweetId}`, { content: updatedContent }, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? {
              ...tweet,
              content: response.data.content,
              updatedAt: response.data.updatedAt,
            }
            : tweet
        )
      );
    } catch (error) {
      console.error('Error updating tweet:', error);
    }
  };

  const handleDelete = async (tweetId) => {
    try {
      await axios.delete(`http://localhost:8080/tweets/${tweetId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setTweets((prevTweets) => prevTweets.filter((tweet) => tweet._id !== tweetId));
    } catch (error) {
      console.error('Error deleting tweet:', error);
    }
  };

  const handleReply = async (tweetId, replyContent) => {
    try {
      await axios.post(
        `http://localhost:8080/tweets/${tweetId}/reply`,
        { content: replyContent },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      setTweets((prevTweets) =>
        prevTweets.map((tweet) =>
          tweet._id === tweetId
            ? {
              ...tweet,
              replies: [
                ...tweet.replies,
                {
                  userId: "",
                  username: "",
                  content: replyContent,
                },
              ],
            }
            : tweet
        )
      );
    } catch (error) {
      console.error('Error adding reply:', error);
    
    }
  };

  const handleFollow = async (userId) => {
    try {
      const response = await axios.post(
        `http://localhost:8080/follow/${userId}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      console.log('Follow API Response:', response);

      const updatedTweets = await axios.get('http://localhost:8080/tweets');
      setTweets(updatedTweets.data);
      setFollowing((prevFollowing) => !prevFollowing);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get('http://localhost:8080/tweets');
        setTweets(response.data);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    };

   

    fetchTweets();
  }, []);

  return (
    <>
      <div>
        <NavProfile />
        <h1 className="shadow-lg p-3 mb-10 bg-body" style={{ marginLeft: '34%', fontSize: '20px', fontWeight: 'bold', width: '32%', textAlign: 'center' }}>TWEET OF THE DAY</h1>
        <form onSubmit={handleTweetSubmit}>
          <div>
            <label className="lable" style={{ marginLeft: '34%', fontSize: '20px', fontWeight: 'bold', width: '33%' }}>Content:</label>
            <textarea value={content} onChange={handleContentChange} className="form-control" style={{ marginLeft: '34%', fontSize: '20px', fontWeight: 'bold', width: '32%' }} />
          </div>
          <div>
            <label className="lable" style={{ marginLeft: '34%', fontSize: '20px', fontWeight: 'bold', width: '32%' }}>Image:</label>
            <input type="file" onChange={handleImageChange} className="form-control" style={{ marginLeft: '34%', fontSize: '20px', width: '32%' }} />
          </div>
          <div>
            <button type="submit" className="form-control" style={{ marginLeft: '34%', fontSize: '20px', fontWeight: 'bold', width: '5%', backgroundColor: 'blue' }}>Post</button>
          </div>
        </form>

        <h1 className="shadow-lg p-3 mb-10 bg-body" style={{ marginLeft: '34%', fontSize: '20px', fontWeight: 'bold', width: '32%', textAlign: 'center' }}>TWEET LIST</h1>
        {tweets.map((tweet) => (
          <div key={tweet._id} className='container' style={{ width: '600px', margin: 'auto', marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}>
            <div className='row'>
              <div className='col'>
                <img
                  src={`data:image/jpg;base64,${tweet.tweetBy.profilePic}`}
                  alt="Profile Pic"
                  style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }}
                />
                <p className="shadow-lg p-1 mb-2 bg-body" style={{ fontSize: '14px', fontWeight: 'bold' }}><strong>@{tweet.tweetBy.username}</strong> - {new Date(tweet.createdAt).toLocaleString()}</p>

                <p className="shadow-lg p-3 mb-2 bg-body" style={{ fontSize: '16px' }}>{tweet.content}</p>
                {tweet.image && <img src={`data:image/jpeg;base64,${tweet.image}`} alt="Tweet" className="shadow-lg p-3 mb-2 bg-body" style={{ width: '100%', maxHeight: '400px' }} />}
              </div>
            </div>
            <div className="row" style={{ marginLeft: '0' }}>
              <div className='col'>

                <button onClick={() => handleLike(tweet._id)} className="heart" style={{ width: '30px', marginRight: '10px', color: likedTweets.includes(tweet._id) ? 'red' : 'black', border: 'none' }}>
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <span>Likes: {tweet.likes.length}</span>
              </div>




              <div className='col'>
                <button onClick={() => handleUpdate(tweet._id)} style={{ marginRight: '50px', width: '33px' }}> <FontAwesomeIcon icon={faEdit} /></button>
                <button onClick={() => handleDelete(tweet._id)} style={{ marginRight: '50px', width: '33px' }}> <FontAwesomeIcon icon={faTrash} /></button>
                <button onClick={() => handleFollow(tweet.tweetBy.userId)} style={{ marginRight: '45px', border: 'none', color: 'blue', fontWeight: 'bold' }}>
                  {following ? 'Following' : 'Follow'}
                </button>
              </div>
              {tweet.replies.map((reply) => (
                <div key={reply._id}>
                  <p><strong>@{reply.username}</strong> : {reply.content}</p>
                </div>
              ))}
              <textarea placeholder="" onChange={(e) => setReplyContent(e.target.value)} />
              <button onClick={() => handleReply(tweet._id, replyContent)}>Retweet</button>
            </div>

          </div>
        ))}
      </div>
    </>
  );
};

export default TweetComponent;

