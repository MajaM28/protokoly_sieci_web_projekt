import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function GamePage() {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [card, setCard] = useState(null);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [markedPositions, setMarkedPositions] = useState([[2, 2]]);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const fetchGameData = async () => {
      const res = await fetch(`http://localhost:3000/api/games/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const gameData = await res.json();
      setGame(gameData);
      return gameData;
    };

    const fetchUserCardData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;

      const res = await fetch(
        `http://localhost:3000/api/cards?gameId=${gameId}&userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const cardData = await res.json();
      setCard(cardData[0]);
    };
    fetchGameData();
    fetchUserCardData();
  }, [gameId]);

  useEffect(() => {
    if (!gameId) return;
    const interval = setInterval(() => {
      const postNumber = async () => {
        const res = await fetch(
          `http://localhost:3000/api/games/${gameId}/draw`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        const data = await res.json(); // np data = { number: 42, allDrawn: [5, 12, 42] }
        setDrawnNumbers(data.allDrawn);
      };
      postNumber();
    }, 5000);

    return () => clearInterval(interval);
  }, [gameId]);

  function bgColor(num, row, col) {
    if (num === "FREE SPACE") {
      return "#008000";
    }

    let isMarked = false;
    for (let i = 0; i < markedPositions.length; i++) {
      const pos = markedPositions[i];

      if (pos[0] === row && pos[1] === col) {
        isMarked = true;
        break;
      }
    }

    if (isMarked) {
      return "#008000";
    }

    if (drawnNumbers.includes(num)) {
      return "#FFDE21";
    }
    return "white";
  }

  function handleNumClick(num, row, col) {
    if (num === "FREE SPACE") {
      return;
    }
    if (!drawnNumbers.includes(num)) {
      alert("This number hasn't been drawn yet!");
      return;
    }

    let alreadyMarked = false;
    for (let i = 0; i < markedPositions.length; i++) {
      const pos = markedPositions[i];
      if (pos[0] === row && pos[1] === col) {
        alreadyMarked = true;
        break;
      }
    }

    if (alreadyMarked) {
      alert("You've already marked this number!");
      return;
    }

    setMarkedPositions((prev) => {
      return [...prev, [row, col]]; //pamietaj o spread operator!
    });
  }

  return (
    <div className="gameContainer">
      {!game || !card ? (
        <div>Loading...</div>
      ) : (
        <div className="div">
          <div className="gameHeader">
            <h1>{game.name}</h1>
          </div>
          <div className="drawnNumbersContainer">
            <h3>Drawn Numbers:</h3>
            <div className="drawnNumbersList">
              {drawnNumbers.length === 0
                ? "No numbers yet..."
                : drawnNumbers.join(", ")}
            </div>
          </div>

          <div className="cardContainer">
            <h3>Your Card:</h3>
            <div className="bingoGrid">
              {card.numbers.flat().map((num, index) => {
                const row = Math.floor(index / 5);
                const col = index % 5;
                return (
                  <div
                    key={index}
                    className={`bingoCell`}
                    onClick={() => handleNumClick(num, row, col)}
                    style={{ backgroundColor: bgColor(num, row, col) }}
                  >
                    {num === "FREE SPACE" ? "☆" : num}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
