import { useState } from "react"
import { GameBoard } from "./components/GameBoard"
import Player from "./components/Player"
import { Log } from "./components/Log"
import { WINNING_COMBINATIONS } from "./winning-combinations"
import { GameOver } from "./components/GameOver"

const PLAYERS = {
  X: "Player 1",
  O: "Player 2"
}

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

function deriveActivePlayer(gameTurns) { // Aktif oyuncuyu türetmek için helper fonksiyon
  let currentPlayer = 'X'; // Şu anki oyuncu X diyelim.

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O"; // En son oyuncu X ise sonraki O olacak en nihayetinde.
  }

  return currentPlayer;
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map(array => [...array])];

  for (const turn of gameTurns) { // Eğer INITIAL_GAME_BOARD boş ise for döngüsü çalışmaz. (JS davranışı)
    const { square, player } = turn; // { square: { row: rowIndex, col: colIndex }, player: currentPlayer } square ve player'i parçaladık.
    const { row, col } = square; // square (yukarıda parçaladığımız) de obje ve row ve col var.

    gameBoard[row][col] = player; // ilgili kutuya player (player sembolü) koyduk.

    // Bug: Kullandığımız gameBoard array'inin referans array'i INITIAL_GAME_BOARD. gameTurns ise başka bir array.

  }

  return gameBoard;
}

function deriveWinner(gameBoard, players) {
  let winner;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column];

    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol) { // eşit olup olmadıklarından ziyade önce null mu değil mi onu kontrol ederiz. Çünkü null JS'te falsy bir ifade.
      winner = players[firstSquareSymbol]; // Yani kazanan oyuncunun sembolü.
    }
  }

  return winner;
}

function App() {
  const [players, setPlayers] = useState(PLAYERS);

  const [gameTurns, setGameTurns] = useState([]) // [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, {...}...]

  const activePlayer = deriveActivePlayer(gameTurns) // Player.jsx'e aktif player UI'ı için gönderiyoruz. Aktif olanın çerçevesi yanıyo ya.

  const gameBoard = deriveGameBoard(gameTurns);

  const winner = deriveWinner(gameBoard, players)

  let hasDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) { // GameBoard'da butona tıklanınca çalışıyor.
    setGameTurns(prevTurns => {

      const currentPlayer = deriveActivePlayer(prevTurns)

      const updatedTurns = [{ square: { row: rowIndex, col: colIndex }, player: currentPlayer }, ...prevTurns]; // immutable array ve bunun önüne yeni info ekledik. Obje olarak store edelim. Bu objede de kutu ve içinde row, col bilgisi olsun ki hangi kutu olduğunu bilelim. Kutu infosu yani. Bu yüzden handleSelectSquare fonksiyonuna rowIndex ve colIndex parametrelerini aldık. Aynı zamanda hangi oyuncunun tıkladığı bilgisi de lazım bu square'de.

      return updatedTurns;
    })
  }

  function handleRestart() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers(prevPlayers => {
      return {
        ...prevPlayers,
        [symbol]: newName // Burada override yapıyoruz. JS yazım türü.
      }
    }) // Sadece bir save'de bir oyuncu değişeceği için old state'i tutmak lazım. Çünkü {X: "Player 1", Y: "Player 2"}
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName={PLAYERS.X} symbol="X" isActive={activePlayer === "X"} onChangeName={handlePlayerNameChange} />
          <Player initialName={PLAYERS.O} symbol="O" isActive={activePlayer === "O"} onChangeName={handlePlayerNameChange} />
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart} />}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
