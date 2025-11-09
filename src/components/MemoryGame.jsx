import React, { useEffect, useState, useCallback } from 'react'

const MemoryGame = () => {
    const [gridSize, setGridSize] = useState(4)
    const [cards, setCards] = useState([]);

    const [flipped, setFlipped] = useState([])
    const [solved, setSolved] = useState([])
    const [disabled, setDisabled] = useState(false)

    const [won, setWon] = useState(false)


    const handleGridSizeChange = (e) => {
        const value = e.target.value;
        const size = parseInt(value);

        if (value === '' || (size >= 2 && size <= 10)) {
            setGridSize(value === '' ? '' : size);
        }
    }

    const createGame = useCallback(() => {
        const totalCards = gridSize * gridSize; // 16
        const pairCount = Math.floor(totalCards / 2); // 8
        const numbers = [...Array(pairCount).keys()].map(n => n + 1);
        const shuffledCards = [...numbers, ...numbers]
            .sort(() => Math.random() - 0.5)
            .slice(0, totalCards)
            .map((num, index) => ({ id: index, num }))

        setCards(shuffledCards);
        setFlipped([]);
        setSolved([]);
        setWon(false);
    }, [gridSize])

    const handleClickCard = (id) => {
        if (disabled || won) return;

        if (flipped.length === 0) {
            setFlipped([id])
            return
        }

        if (flipped.length === 1) {
            setDisabled(true);
            if (id !== flipped[0]) {
                setFlipped([...flipped, id])
                checkMatch(id);
            } else {
                setFlipped([])
                setDisabled(false);
            }
        }
    }

    const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
    const isSolved = (id) => solved.includes(id);

    const checkMatch = (secondId) => {
        const firstId = flipped[0];
        if (cards[firstId].num === cards[secondId].num) {
            setSolved([...solved, firstId, secondId]);
            setFlipped([]);
            setDisabled(false);
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000)
        }
    }

    useEffect(() => {
        createGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridSize])

    useEffect(() => {
        if (solved.length === cards.length && cards.length > 0) {
            setWon(true);
        }
    }, [solved, cards])

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
            <h1 className='text-3xl font-bold mb-6'>Memory Game</h1>
            {/* input field */}
            <div className='mb-4'>
                <label htmlFor="gridSize" className='mr-2'>Grid Size: (max 10)</label>
                <input
                    type="number"
                    id='gridSize'
                    onChange={handleGridSizeChange}
                    min={2}
                    max={10}
                    value={gridSize}
                    className='border-2 border-gray-300 rounded px-2 py-1'
                />
            </div>
            {/* board */}
            <div className='grid gap-2 mb-4'
                style={{
                    gridTemplateColumns: `repeat(${gridSize}, minmax(0,1fr))`,
                    width: `min(100, ${gridSize * 5.5}rem)`
                }}
            >
                {cards.map(card =>
                    <div key={card.id}
                        className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg
                         cursor-pointer transition-all duration-300 ${isFlipped(card.id) ? isSolved(card.id) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-400'}`}
                        onClick={() => handleClickCard(card.id)}
                    >
                        {isFlipped(card.id) ? card.num : "?"}
                    </div>
                )}
            </div>

            {/* result display  */}
            {won && <div className='mt-4 text-4xl font-bold text-green animate-bounce'>
                You Win!
            </div>}

            {/* reset button */}
            <button onClick={createGame} className='mt-4 px-1 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'>
                {won ? "Play Again" : "Reset Game"}
            </button>
        </div>
    )
}

export default MemoryGame
