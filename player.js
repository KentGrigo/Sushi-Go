class Player {
    constructor(name) {
        this.id = crypto.randomUUID()
        this.name = name
        this.cards = []
        this.playedCards = []
    }

    newCards(cards) {
        this.cards = cards
        this.playedCards = []
    }

    playCard(cardIndex) {
        const playedCard = this.cards.splice(cardIndex, 1)[0]
        this.playedCards.push(playedCard)
        return playedCard
    }
}
