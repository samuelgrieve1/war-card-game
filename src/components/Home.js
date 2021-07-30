import React from 'react';
import { Link } from 'react-router-dom';

const Home = (props) => {
  return(
    <div className="grid-x grid-margin-y">
      <div className="cell">
        <ht>War: Star Trek Edition</ht>
        <Link to="/game"><button className="button">Play Now</button></Link>
      </div>
    </div>
  )
}

export default Home