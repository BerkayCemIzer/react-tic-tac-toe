import React from 'react'

export const Log = ({ turns }) => {
  return (
    <ol id="log">
      {turns.map((turn) => {
        const { square, player } = turn;
        const {row, col} = square;

        return <li key={`${row}${col}`}>Player Symbol: {player} & row: {row} - col: {col}</li>
      }
      )}
    </ol>
  )
}
