import React from 'react'

const Card = (props) => {
  return(
    <div>
      {props.value}
      {props.suit}
      <img src={props.image}></img>
    </div>
  )
}

export default Card