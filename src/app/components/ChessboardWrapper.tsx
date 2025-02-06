'use client'
import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';

interface ChessboardWrapperProps {
  onHistoryChange?: (history: string[]) => void;
}

const ChessboardWrapper: React.FC<ChessboardWrapperProps> = ({ onHistoryChange }) => {
  // Initialize a new Chess game instance.
  const [game, setGame] = useState(new Chess());
  // For highlighting the available moves.
  const [highlightedSquares, setHighlightedSquares] = useState<{ [square: string]: React.CSSProperties }>({});

  // The handler now correctly accepts both piece and square parameters.
  const handlePieceClick = (piece: string, square: Square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length) {
      // Build an object with custom styles for each possible destination square.
      const highlights = moves.reduce((acc, move) => {
        acc[move.to] = { background: 'rgba(255, 255, 0, 0.4)' };
        return acc;
      }, {} as { [square: string]: React.CSSProperties });
      setHighlightedSquares(highlights);
    } else {
      setHighlightedSquares({});
    }
  };

  // Handle dropping a piece from one square to another.
  const onDrop = (sourceSquare: string, targetSquare: string) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // Always promote to queen for simplicity.
    });

    // Illegal move
    if (move === null) return false;

    // Update the game state.
    setGame(new Chess(game.fen()));
    setHighlightedSquares({});

    // Call the onHistoryChange prop if it's provided.
    if (onHistoryChange) {
      onHistoryChange(game.history());
    }
    return true;
  };

  return (
    <div className="flex flex-col items-center">
      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        onPieceDragBegin={handlePieceClick}
        boardWidth={500}
        customSquareStyles={highlightedSquares}
      />
    </div>
  );
};

export default ChessboardWrapper;
