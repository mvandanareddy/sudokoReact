import React, { useState, useEffect } from "react";

const generateBoard = (difficulty: "easy" | "medium" | "hard") => {
  const board = Array.from({ length: 9 }, () => Array(9).fill(""));

  const solveBoard = (b: string[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (b[row][col] === "") {
          for (let num = 1; num <= 9; num++) {
            if (isValid(b, row, col, num.toString())) {
              b[row][col] = num.toString();
              if (solveBoard(b)) {
                return true;
              }
              b[row][col] = "";
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const createPuzzle = (b: string[][], fillCount: number) => {
    const puzzle = b.map((row) => row.slice());
    let removed = 81 - fillCount;

    while (removed > 0) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      if (puzzle[row][col] !== "") {
        puzzle[row][col] = "";
        removed--;
      }
    }

    return puzzle;
  };

  solveBoard(board);
  const fillCount = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 18;
  return createPuzzle(board, fillCount);
};

const isValid = (board: string[][], row: number, col: number, value: string): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === value) return false;
  }

  for (let i = 0; i < 9; i++) {
    if (board[i][col] === value) return false;
  }

  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === value) return false;
    }
  }

  return true;
};

const Sudoku: React.FC = () => {
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [board, setBoard] = useState(generateBoard(difficulty));
  const [originalBoard, setOriginalBoard] = useState(board);
  const [error, setError] = useState("");
  const [mistakes, setMistakes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const newBoard = generateBoard(difficulty);
    setBoard(newBoard);
    setOriginalBoard(newBoard);
    setError("");
    setMistakes(0);
    setIsGameOver(false);
    setIsWinner(false);
  }, [difficulty]);

  const handleChange = (row: number, col: number, value: string) => {
    if (!/^[1-9]?$/.test(value)) {
      setError("Only numbers 1-9 are allowed.");
      return;
    }

    if (originalBoard[row][col] !== "") {
      return;
    }

    setError("");
    if (value === "" || isValid(board, row, col, value)) {
      const newBoard = board.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? value : cell))
      );
      setBoard(newBoard);

      // Check if the board is complete
      if (newBoard.every((r) => r.every((cell) => cell !== ""))) {
        setIsWinner(true);
        setIsGameOver(true);
      }
    } else {
      setError("Invalid move. Violates Sudoku rules.");
      setMistakes((prev) => {
        const newMistakes = prev + 1;
        if (newMistakes >= 5) {
          setIsGameOver(true);
        }
        return newMistakes;
      });
    }
  };

  const handleReset = () => {
    const newBoard = generateBoard(difficulty);
    setBoard(newBoard);
    setOriginalBoard(newBoard);
    setError("");
    setMistakes(0);
    setIsGameOver(false);
    setIsWinner(false);
  };

  const handlePlayAgain = () => {
    const newBoard = generateBoard(difficulty);
    setBoard(newBoard);
    setOriginalBoard(newBoard);
    setError("");
    setMistakes(0);
    setIsGameOver(false);
    setIsWinner(false);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", textAlign: "center", padding: "20px",justifyContent:'center',alignItems:'center',display:'flex',flexDirection:'column' }}>
      <h1 style={{ color: "purple", fontSize: "2rem", fontWeight: "bold" }}>Sudoku</h1>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold", color: "purple", marginRight: "10px" }}>
          Select Difficulty:
        </label>
        <select
          style={{
            padding: "5px 10px",
            fontSize: "1rem",
            border: "2px solid #ccc",
            borderRadius: "5px",
          }}
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {isGameOver ? (
        <div>
          {isWinner ? (
            <h2 style={{ color: "green", fontSize: "1.5rem", fontWeight: "bold" }}>
              Congratulations! You won!
            </h2>
          ) : (
            <h2 style={{ color: "red", fontSize: "1.5rem", fontWeight: "bold" }}>
              You lost! Made 5 mistakes.
            </h2>
          )}
          <button
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(9, 40px)",
              gap: "5px",
              justifyContent: "center",
            }}
          >
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <input
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    fontSize: "1.2rem",
                    textAlign: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: originalBoard[rowIndex][colIndex] ? "#eaeaea" : "white",
                    color: originalBoard[rowIndex][colIndex] ? "#555" : "black",
                  }}
                  value={cell}
                  onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                  maxLength={1}
                  disabled={!!originalBoard[rowIndex][colIndex]}
                />
              ))
            )}
          </div>
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
          <p style={{ color: "red", marginTop: "10px" }}>Mistakes: {mistakes}/5</p>
          <div style={{ marginTop: "20px" }}>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "1rem",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sudoku;
