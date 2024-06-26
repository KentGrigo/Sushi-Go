class Player {
    constructor(cards) {
        this.cards = cards
        this.playedCards = []
    }

    playCard(cardIndex) {
        const playedCard = this.cards.splice(cardIndex, 1)
        this.playedCards.push(playedCard)
    }
}
