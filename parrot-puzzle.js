document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const scoreDisplay = document.getElementById('score');
    const resetButton = document.getElementById('resetButton');

    const parrots = ['🦜', '🐦', '🕊️', '🦢', '🦉', '🐧', '🐥', '🦆'];
    let cards = [];
    let flippedCards = [];
    let matchedCards = 0;
    let score = 0;
    let lockBoard = false;

    function createBoard() {
        // Duplicate parrots to create pairs
        cards = [...parrots, ...parrots];
        shuffle(cards);
        gameBoard.innerHTML = '';
        score = 0;
        scoreDisplay.textContent = score;
        matchedCards = 0;
        flippedCards = [];
        lockBoard = false;

        cards.forEach((parrot, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = index;
            card.dataset.parrot = parrot;
            card.innerHTML = `
                <div class="card-front">${parrot}</div>
                <div class="card-back">?</div>
            `;
            card.addEventListener('click', flipCard);
            gameBoard.appendChild(card);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return; // Prevent double clicking the same card

        this.classList.add('flip');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.parrot === card2.dataset.parrot;

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        const [card1, card2] = flippedCards;
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        card1.classList.add('matched');
        card2.classList.add('matched');
        score += 10;
        scoreDisplay.textContent = score;
        matchedCards += 2;
        resetBoard();

        if (matchedCards === cards.length) {
            setTimeout(() => alert(`Congratulations! You matched all parrots! Your score: ${score}`), 500);
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove('flip');
            flippedCards[1].classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    resetButton.addEventListener('click', createBoard);

    createBoard();
});