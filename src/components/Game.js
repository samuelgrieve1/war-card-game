import React, { useState, useEffect } from 'react'
import Card from './Card'
import Controls from './Controls'
import logo from '../img/back-of-card.png'

const Game = (props) => {
  const [deck, setDeck] = useState([])

  useEffect( () => {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => {
      if(response.ok){
        return response
      } else{
        let errorMessage = `${response.status}(${response.statusText})`,
        error = new Error(errorMessage)
        throw(error)
      }
    })
    .then(response => {
      return response.json()
    })
    .then(body => {
      setDeck(body)
      if (deck.remaining > 0) {
        drawCard()
      }
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }, [])

  // let cards

  // if (deck.cards) {
  //   cards = deck.cards.map((card) => {
  //     return(
  //       <Card
  //         key = {card.id}
  //         id = {card.id}
  //         value = {card.value}
  //         suit = {card.suit}
  //         image = {card.image}
  //       />
  //     )
  //   })
  // }

  const userCardPlayed = document.getElementById("user-card-played")
  const compCardPlayed = document.getElementById("comp-card-played")

  const drawCard = event => {
    if (deck.remaining > 0) {
      fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=2`)
      .then(response => {
        return response.json()
      })
      .then(card => {
        if(card.cards){
          userCardPlayed.innerHTML = `<img src=${card.cards[0].image}></img>`
          compCardPlayed.innerHTML = `<img src=${card.cards[1].image}></img>`
        }
        deck.remaining -= 2
        alert("Whatchya clickin that for stupid!")
      })
    }else{
      userCardPlayed.innerHTML = "Out of cards"
      compCardPlayed.innerHTML = "Out of cards"
    }
  }

  return(
    <div>
      <div className="grid-x grid-margin-y">
        <div className="cell small-5"></div>
        <div className="cell small-2 card-stack" id="comp-card-stack">
          <img src={logo}></img>
        </div>
        <div className="cell small-2 card-stack" id="comp-discard-stack"></div>
        <div className="cell small-3"></div>
      </div>

      <div className="grid-x grid-margin-y">
        <div className="cell small-4"></div>
        <div className="cell small-2">
          <div className="card-played" id="comp-card-played"></div>
        </div>
        <div className="cell small-2">
          <div className="card-played" id="user-card-played"></div>
        </div>
        <div className="cell small-4"></div>
      </div>

      <div className="grid-x grid-margin-y">
        <div className="cell small-3"></div>
        <div className="cell small-2 card-stack" id="user-discard-stack"></div>
        <div className="cell small-2 card-stack" id="user-card-stack" onClick={drawCard}>
          <img src={logo}></img>
        </div>
        <div className="cell small-5"></div>
      </div>
    </div>
  )
}

export default Game