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
        <h1 className='hero-title'>Welcome to Cinelog</h1>
      </div>
    </div>
  )
}

export default Home
