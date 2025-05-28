import React from 'react'
import './Home.css';
import cinemabg from '../videos/movie.mp4';

function Home() { 
  return (
    <div className='home'>
      <div className='hero-section'>
        <div className='hero-content'>
          <video src={cinemabg} autoPlay loop muted className='hero-video'/>                          
        </div>
        <div className='hero-title-container'>
                  <h1 className='hero-title'>Welcome to Cinelog</h1>
      <p className='hero-description'                     >
        Your ultimate destination for all things cinema. Explore the latest movies,
        find your favorite shows, and get the latest news in the world of cinema.
      </p>
        </div>
        <div className='movies-tv-section'>
          <h1 className='movies-tv-title'>Featured Movies & TV Shows</h1>

        </div>
        <div className='features-section'>
          <h1>Cinalog lets you...</h1>
          <div className='features-grid'>
            <div className='feature-item'>
              <p>Add movies and tv shows to your watchlist</p>
            </div>
            <div className='feature-item'>
              <p>Rate movies on a 5-star rating system</p>
            </div>
            <div className='feature-item'>
              <p>Create a Watch Diary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
