class ColorMemoryGame {
    constructor() {
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.score = 0;
        this.gameActive = true;
        this.difficulty = 'easy';
        this.bestScore = localStorage.getItem('colorMemoryBest') || '-';
        
        this.gameBoard = document.getElementById('gameBoard');
        this.scoreDisplay = document.getElementById('score');
        this.movesDisplay = document.getElementById('moves');
        this.bestDisplay = document.getElementById('best');
        this.resetBtn = document.getElementById('resetButton');
        this.homeBtn = document.getElementById('homeButton');
        this.celebration = document.getElementById('celebration');
        
        this.colors = [
            { bg: '#FF6B6B', emoji: '🍎' },
            { bg: '#4ECDC4', emoji: '🐢' },
            { bg: '#FFE66D', emoji: '⭐' },
            { bg: '#95E1D3', emoji: '🌿' },
            { bg: '#F38181', emoji: '🌸' },
            { bg: '#AA96DA', emoji: '👑' },
            { bg: '#FCBAD3', emoji: '🎈' },
            { bg: '#A8DADC', emoji: '💎' },
            { bg: '#457B9D', emoji: '🧊' },
            { bg: '#F1FAEE', emoji: '☁️' },
            { bg: '#E63946', emoji: '❤️' },
            { bg: '#1D3557', emoji: '🌙' },
            { bg: '#F77F00', emoji: '🧡' },
            { bg: '#06A77D', emoji: '🌲' },
            { bg: '#D62828', emoji: '🔥' },
            { bg: '#F77E21', emoji: '🎃' },
            { bg: '#003049', emoji: '🐳' },
            { bg: '#FB5607', emoji: '🦊' }
        ];
        
        this.bestDisplay.textContent = this.bestScore;
        
        this.setupEventListeners();
        this.initGame();
    }
    
    setupEventListeners() {
        this.resetBtn.addEventListener('click', () => this.initGame());
        this.homeBtn.addEventListener('click', () => this.goHome());
        
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.difficulty = e.target.dataset.difficulty;
                this.initGame();
            });
        });
    }
    
    initGame() {
        this.cards = [];
        this.flipped = [];
        this.matched = [];
        this.moves = 0;
        this.score = 0;
        this.gameActive = true;
        this.celebration.classList.remove('show');
        
        this.updateDisplay();
        this.generateCards();
        this.renderGame();
    }
    
    generateCards() {
        const pairCount = this.difficulty === 'easy' ? 8 : 
                         this.difficulty === 'medium' ? 8 : 12;
        
        const selectedColors = this.colors.slice(0, pairCount);
        
        selectedColors.forEach(color => {
            this.cards.push({ ...color, id: Math.random() });
            this.cards.push({ ...color, id: Math.random() });
        });
        
        this.cards.sort(() => Math.random() - 0.5);
    }
    
    renderGame() {
        this.gameBoard.innerHTML = '';
        this.gameBoard.className = `game-board ${this.difficulty}`;
        
        this.cards.forEach((card, index) => {
            const button = document.createElement('button');
            button.className = 'memory-card';
            button.dataset.index = index;
            
            const front = document.createElement('div');
            front.className = 'card-content card-front';
            front.textContent = '?';
            
            const back = document.createElement('div');
            back.className = 'card-content card-back';
            back.textContent = card.emoji;
            back.style.background = card.bg;
            
            button.appendChild(front);
            button.appendChild(back);
            
            button.addEventListener('click', () => this.flipCard(index));
            this.gameBoard.appendChild(button);
        });
    }
    
    flipCard(index) {
        if (!this.gameActive) return;
        if (this.flipped.includes(index)) return;
        if (this.matched.includes(index)) return;
        if (this.flipped.length >= 2) return;
        
        this.flipped.push(index);
        const cardElement = this.gameBoard.children[index];
        cardElement.classList.add('flipped');
        
        if (this.flipped.length === 2) {
            this.moves++;
            this.updateDisplay();
            this.checkMatch();
        }
    }
    
    checkMatch() {
        const [idx1, idx2] = this.flipped;
        const card1 = this.cards[idx1];
        const card2 = this.cards[idx2];
        
        if (card1.emoji === card2.emoji) {
            this.matched.push(idx1, idx2);
            this.score += 10;
            this.flipped = [];
            
            setTimeout(() => {
                document.querySelectorAll('.memory-card').forEach((card, i) => {
                    if (this.matched.includes(i)) {
                        card.classList.add('matched');
                    }
                });
                
                if (this.matched.length === this.cards.length) {
                    this.gameWon();
                }
            }, 500);
        } else {
            setTimeout(() => {
                const cardElements = this.gameBoard.children;
                cardElements[idx1].classList.remove('flipped');
                cardElements[idx2].classList.remove('flipped');
                this.flipped = [];
            }, 800);
        }
        
        this.updateDisplay();
    }
    
    gameWon() {
        this.gameActive = false;
        this.celebration.classList.add('show');
        
        if (this.bestScore === '-' || this.moves < parseInt(this.bestScore)) {
            this.bestScore = this.moves;
            localStorage.setItem('colorMemoryBest', this.moves);
            this.bestDisplay.textContent = this.moves;
        }
        
        setTimeout(() => {
            alert(`Congratulations! You won in ${this.moves} moves! Score: ${this.score}`);
        }, 800);
    }
    
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.movesDisplay.textContent = this.moves;
    }
    
    goHome() {
        if (confirm('Go back to home? Your current game will be lost.')) {
            window.location.href = 'index.html';
        }
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ColorMemoryGame();
});
