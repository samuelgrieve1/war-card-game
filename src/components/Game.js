import React, { useState, useEffect } from 'react'
import Card from './Card'
import Controls from './Controls'

const Game = (props) => {
  const [deck, setDeck] = useState([])

  useEffect( () => {
    fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=2")
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
    })
    .catch(error => console.error(`Error in fetch: ${error.message}`))
  }, [])

  let cards
  if(deck.cards){
  cards = (
      <div>
        <Card
          key = {deck.cards[0].id}
          id = {deck.cards[0].id}
          value = {deck.cards[0].value}
          suit = {deck.cards[0].suit}
          image = {deck.cards[0].image}
        />
        <Card
          key = {deck.cards[1].id}
          id = {deck.cards[1].id}
          value = {deck.cards[1].value}
          suit = {deck.cards[1].suit}
          image = {deck.cards[1].image}
        />
      </div>
  )}

  const drawCard = event => {
    fetch("https://deckofcardsapi.com/api/deck/<<deck.deck_id>>/draw/?count=2")
    .then(response => response.json())
    .then(response => console.log(response))
  }

  return(
    <div>
      <h1>Hello</h1>
      {cards}
      <Controls drawCard={drawCard} />
    </div>
  )
}

export default Game