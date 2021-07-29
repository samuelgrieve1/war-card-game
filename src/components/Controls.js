import React from 'react'

const Controls = (props) => {
  return(
    <button className="button" onClick={props.drawCard} id="drawCardBtn">Draw Card</button>
  )
}

export default Controls