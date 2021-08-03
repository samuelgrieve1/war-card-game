import React, { useState, useEffect } from 'react'
import cardSpread from '../img/card-spread.png'
import cardSpreadUpsideDown from '../img/card-spread-upside-down.png'
import cardSpace from '../img/card-space.png'
import { getValue } from '../helpers/helpers'
import spock from '../img/spock.png'

const Game = (props) => {
  let compCardCodes = ""
  let userCardCodes = ""

  const [deck, setDeck] = useState({})
  const [compCardPlayed, setCompCardPlayed] = useState(null)
  // const [compCardFetchStarted, setCompCardFetchStarted] = useState(false)
  const [userCardPlayed, setUserCardPlayed] = useState(null)
  // const [bothCardsPlayed, setBothCardsPlayed] = useState(false)
  const [compCardsRemaining, setCompCardsRemaining] = useState(0)
  const [userCardsRemaining, setUserCardsRemaining] = useState(0)

  // Create/shuffle deck
  useEffect( () => {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(response => response.json())
    .then(deck => {
      fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=52`)
      .then(response => response.json())
      .then(drawn => {
        let counter = 0
        drawn.cards.forEach(card => {
          if(counter % 2 === 0){
            compCardCodes += `${card.code},`
            counter += 1
          } else{
            userCardCodes += `${card.code},`
            counter += 1
          }
        })
        return drawn
      })
      // Create two piles of 26 cards
      .then(deck => {
        fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/compPile/add/?cards=${compCardCodes}`)
        .then(response => response.json())
        .then(pile => {
          setDeck(pile)
          setCompCardsRemaining(26)
        })
        return deck
      })
      .then(deck => {
        fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/userPile/add/?cards=${userCardCodes}`)
        .then(response => response.json())
        .then(pile => {
          setDeck(pile)
          setUserCardsRemaining(26)
        })
      }) 
    })

    // Get users name
    if(document.getElementsByClassName("userName")){
      let userNameInput = prompt("What's your name?")
      if(userNameInput === ""){
        userNameInput = "Unnamed Guest"
      }
      let userNames = document.getElementsByClassName("userName")
      for(let i of userNames){
        i.innerHTML = userNameInput
      }
    }
  }, [])

  // // Computer plays first card
  // useEffect( () => {
  //   if(deck && deck.deck_id && !compCardPlayed && !compCardFetchStarted){
  //     fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/compPile/draw/bottom/?count=1`)
  //     .then(response => response.json())
  //     .then(compCard => {
  //       setCompCardPlayed(compCard.cards[0])
  //       setDeck(compCard)
  //     })
  //     setCompCardFetchStarted(true)
  //   }
  // }, [deck, compCardPlayed])

  // Plays cards
  let playACard = event => {
    if(deck && deck.deck_id){
      // Computer
      fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/compPile/draw/bottom/?count=1`)
      .then(response => response.json())
      .then(compCard => {
        setCompCardPlayed(compCard.cards[0])
        setDeck(compCard)
      })
      // User
      fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/userPile/draw/bottom/?count=1`)
      .then(response => response.json())
      .then(userCard => {
        setUserCardPlayed(userCard.cards[0])
        setDeck(userCard)
      })
    }
  }

  // Determine who wins
  useEffect( () => {
    if(userCardPlayed && compCardPlayed){
      if(getValue(userCardPlayed.value) > getValue(compCardPlayed.value)){
        fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/userPile/add/?cards=${compCardPlayed.code}`)
        .then(response => response.json())
        .then(data => {
          setDeck(data)
          setCompCardsRemaining(compCardsRemaining - 1)
          setUserCardsRemaining(userCardsRemaining + 1)
        })

      } else if(getValue(userCardPlayed.value) < getValue(compCardPlayed.value)){
        setCompCardsRemaining(compCardsRemaining + 1)
        setUserCardsRemaining(userCardsRemaining - 1)
      } else{
        console.log("WAR!")
      }
    }
  }, [userCardPlayed])

  // const drawCard = event => {
  //   if (deck.piles.userPile.remaining > 0) {
  //     fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=2`)
  //     .then(response => response.json())
  //     .then(data => {

  //       // User plays card
  //       if(data.cards){
  //         userCardPlayed.innerHTML = `<img src=${data.cards[0].image}></img>`
  //         userCardPlayedValue = getValue(data.cards[0].value)
  //       }
  //       deck.remaining -= 1

  //       // Decide who wins hand
  //       if(userCardPlayedValue > compCardPlayedValue){
  //         // User wins
  //         // Add comp/user cards to users pile
  //         userDiscardStack.innerHTML = `<img src=${data.cards[0].image}></img>`
  //         // 
  //       } else if(userCardPlayedValue < compCardPlayedValue){
  //           // Computer wins
  //           console.log("You lose!")
  //       } else{
  //           // War!
  //           console.log("War!")
  //       }

  //       // Comp plays new card
  //       // setTimeout(function(){
  //       //   compCardPlayed.innerHTML = `<img src=${card.cards[0].image}></img>`
  //       //   compCardPlayedValue = getValue(card.cards[0].value)
  //       // }
  //       // , 2000)
  //     })
  //   }else{
  //     userCardPlayed.innerHTML = "Out of cards"
  //   }
  // }

  return(
    <div>
      <div className="grid-x">

        <div className="cell medium-4 black-bg cell-padding-top lefty">
          <div className="cell medium-12"><p><img id="ship" src={spock}></img></p><h3>War: Star Trek Edition</h3><br></br></div>
          <div className="cell medium-12">
            <h1>Computer<br></br>vs<br></br><span className="userName"></span></h1>
            <br></br>
            <p><b>Score:</b> &nbsp;&nbsp;&nbsp;&nbsp; Computer: 0 &nbsp;&nbsp;&nbsp;&nbsp; <span className="userName"></span>: 0</p>
            <br></br>
          </div>
          <div className="cell medium-12">
            <button className="button" id="playACard" onClick={playACard}>Play a card</button>
            <p>(You can also click on your deck to play a card)</p>
          </div>
        </div>

        <div className="cell medium-8 table-bg righty">
          <div className="grid-x">
            
            <div className="cell medium-12 compCards">
              <div className="grid-x">
                <div className="cell medium-2"></div>
                <div className="cell medium-10" id="comp-card-stack">
                  <img src={cardSpreadUpsideDown}></img>
                </div>
                {/* <div className="cell medium-6 card-stack rotate-left" id="comp-discard-stack"></div> */}
              </div>
            </div>
            
            <div className="cell medium-12 cardsPlayed">
              <div className="grid-x">
                <div className="cell medium-3 cardNumbers"></div>
                <div className="cell medium-3">
                  <div className="card-played" id="comp-card-played">
                    {compCardPlayed ? <img src={compCardPlayed.image}></img> : <img src={cardSpace}></img>}
                    <p>Computer</p>
                  </div>
                </div>
                <div className="cell medium-3">
                  <div className="card-played" id="user-card-played">
                    {userCardPlayed ? <img src={userCardPlayed.image}></img> : <img src={cardSpace}></img>}
                    <p><span className="userName"></span></p>
                  </div>
                </div>
                <div className="cell medium-3"></div>
              </div>
            </div>

            <div className="cell medium-12 userCards">
              <div className="grid-x">
                {/* <div className="cell medium-6 card-stack rotate-left" id="user-discard-stack"></div> */}
                <div className="cell medium-12">
                  <p>Computer has <b>{compCardsRemaining} Cards</b> | <span className="userName"></span> has <b>{userCardsRemaining} Cards</b></p>
                </div>
                <div className="cell medium-10" id="user-card-stack" onClick={playACard}>
                  {/* <img src={backOfCard}></img> */}
                  <img src={cardSpread}></img>
                </div>
                <div className="cell medium-2"></div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default Game