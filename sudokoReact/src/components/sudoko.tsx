import React, { useState } from 'react';

const generateBoard = (difficulty: "easy" | "medium" | "hard") => {
  // Placeholder for dynamic puzzle generation logic based on difficulty
  return Array.from({ length: 9 }, () => Array(9).fill("")); // Generates a 9x9 empty grid
};

export const Sudoku: React.FC = () => {
  // State for board, difficulty level, and error messages
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [board, setBoard] = useState(generateBoard(difficulty));
  const [error, setError] = useState<string>('');

  // Handle changes in individual Sudoku cells
  const handleChange = (row: number, col: number, value: string) => {
    if (!/^[1-9]?$/.test(value)) {
      setError("Only numbers 1-9 are allowed.");
      return;
    }
    setError(""); // Clear the error if the input is valid
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? value : cell))
    );
    setBoard(newBoard);
  };

  // Reset the board to an empty grid
  const handleReset = () => {
    setBoard(generateBoard(difficulty));
    setError(""); // Clear any error message
  };

  // Handle difficulty change
  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as 'easy' | 'medium' | 'hard';
    setDifficulty(newDifficulty);
    setBoard(generateBoard(newDifficulty)); // Reset the board with the new difficulty
  };

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Sudoku Game</h1>

      {/* Difficulty Level Selection */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Difficulty Levels:</h3>
        <select onChange={handleDifficultyChange} value={difficulty}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Sudoku Grid */}
      <div style={{  display: 'grid', gridTemplateColumns: 'repeat(9, 42px)', gap: '2px',padding:'1px' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              maxLength={1} // Only allow one character
              value={cell}
              onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
              style={{
                width: '30px',
                height: '30px',
                textAlign: 'center',
                fontSize: '16px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
                borderRadius: '4px',
                padding: '5px',
                margin: '2px',
                gap:'3px'
              }}
            />
          ))
        )}
      </div>

      {/* Error Message */}
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

      {/* Reset Button */}
      <button
        onClick={handleReset}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Reset
      </button>
    </div>
  );
};
