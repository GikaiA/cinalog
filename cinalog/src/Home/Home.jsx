import React from 'react'
import './Home.css';
import cinemabg from '../images/cinema.jpg';

function Home() {
  return (
    <div className='home'>
        <div className='bg-wrapper'>
          <img src={cinemabg} alt='cinemabg' className='cinemabg'/>
        </div>
      <div className='hero-section'>
        <h1 className='hero-title'>Welcome to Cinelog</h1>
      </div>
    </div>
  )
}

export default Home
