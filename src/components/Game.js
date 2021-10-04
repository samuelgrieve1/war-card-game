// Import React
import React, { useState, useEffect } from 'react'

// Get Helpers
import { getValue } from '../helpers/helpers'

// Get Images
import cardSpread from '../img/card-spread.png'
import cardSpreadUpsideDown from '../img/card-spread-upside-down.png'
import cardSpace from '../img/card-space.png'
import logo from '../img/logo.png'

// Initialize Game
const Game = (props) => {

  let compCardCodes = ""
  let userCardCodes = ""

  const [deck, setDeck] = useState({})
  const [compCardPlayed, setCompCardPlayed] = useState(null)
  const [userCardPlayed, setUserCardPlayed] = useState(null)
  const [compCardsRemaining, setCompCardsRemaining] = useState(0)
  const [userCardsRemaining, setUserCardsRemaining] = useState(0)
  const [loadState, setLoadState] = useState(false)

    // TODO
    // put second fetches into prior then (It looks like maybe thise has already been done on lines 56 - 92?)
    // visual loader
    // Show real number of cards
    // Use animation to move cards || flip animation
    // Hide everything until name is entered (cards)
    // sam vs computer smaller
    // play button nicer
    // visual loader: spin circle over cards
    // Try vue.js

    // DONE
    // score nicer
    // if (loadState) return
    // setLoadState = true
    // Set load state false
    // add catch to fetch that throws an error to user
    // .finally (put load state inside this)


  // Start Game
  // Create/shuffle deck
  let startGame = event => {
    document.getElementById('startGame').classList.add('hidden')
    document.getElementById('playACard').classList.remove('hidden')
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
    // Show Card Spreads
    let compCardStack = document.getElementById('comp-card-stack')
    for(let i = 0; i < 26; i++){
      compCardStack.innerHTML += '<img src={backOfCard}></img>'
    }

  }

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
    if(deck && deck.deck_id && !loadState){
      setLoadState(true)
      // Computer
      fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/compPile/draw/bottom/?count=1`)
      .then(response => response.json())
      .then(compCard => {
        setCompCardPlayed(compCard.cards[0])
        setDeck(compCard)
        return fetch(`https://deckofcardsapi.com/api/deck/${deck.deck_id}/pile/userPile/draw/bottom/?count=1`)
      })
      // User
      .then(response => response.json())
      .then(userCard => {
        setUserCardPlayed(userCard.cards[0])
        setDeck(userCard)
      })
      .catch(() => {alert("The promise has been broken!")})
      .finally(
        setLoadState(false)
      )
      // Add/Remove cards from decks
      let compCardStack = document.getElementById('comp-card-stack')
      for(let i = 0; i < compCardsRemaining; i++){
        compCardStack.innerHTML += "Hello "
      }
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
          <div className="cell medium-12"><p><img id="ship" src={logo}></img></p><br></br></div>
          <div className="cell medium-12">
            {/* Comp vs User */}
            <div className="t-user-vs-comp">
              <h1>Computer vs. <span className="userName"></span></h1>
            </div>
            <br></br>
          </div>
          <div className="cell medium-12">
            <div className="t-score-board">
            {/* Score */}
            <div className="t-score-big">
              <p>Score</p>
            </div>
            <div className="t-score-small">
              <p>Computer: 0<br></br><span className="userName"></span>: 0</p>
            </div>
            <br></br>
            </div>
          </div>
          <div className="cell medium-12">
            <button className="button" id="startGame" onClick={startGame}>Start Game</button>
            <button className="button hidden" id="playACard" onClick={playACard}>Play a card</button>
          </div>
        </div>
        <div className="cell medium-8 table-bg righty">
          <div className="grid-x">
            <div className="cell medium-12 compCards">
              <div className="grid-x">
                <div className="cell medium-2"></div>
                <div className="cell medium-10" id="comp-card-stack">
                  {/* <img src={cardSpreadUpsideDown}></img> */}
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
                  {/* <img src={cardSpread}></img> */}
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