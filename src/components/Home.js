import React from 'react';
import { Link } from 'react-router-dom';
import cardSpread from '../img/card-spread.png'

const Home = (props) => {
  return(
    <div className="grid-x grid-margin-y">
      <div className="cell"></div>
      <div className="cell medium-2"></div>
      <div className="cell medium-8 black-bg cell-padding">
        <img src={cardSpread}></img><h1>War: Star Trek Edition</h1>
        <Link to="/game"><button className="button">Play Now</button></Link>
        <h2>How to play</h2>
        <p>The goal is to be the first player to win all 52 cards</p>
        <h3>The Deal</h3>
        <p>The deck is divided evenly, with each player receiving 26 cards, dealt one at a time, face down. Anyone may deal first. Each player places their stack of cards face down, in front of them.</p>
        <h3>The Play</h3>
        <p>Each player turns up a card at the same time and the player with the higher card takes both cards and puts them, face down, on the bottom of his stack.</p>
        <p>If the cards are the same rank, it is War. Each player turns up one card face down and one card face up. The player with the higher cards takes both piles (six cards). If the turned-up cards are again the same rank, each player places another card face down and turns another card face up. The player with the higher card takes all 10 cards, and so on.</p>
        <h3>How to Keep Score</h3>
        <p>The game ends when one player has won all the cards.</p>
      </div>
      <div className="cell medium-2"></div>
    </div>
  )
}

export default Home