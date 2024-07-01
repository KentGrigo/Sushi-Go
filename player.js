class Player {
    constructor(name, cards) {
        this.id = crypto.randomUUID()
        this.name = name
        this.cards = cards
        this.playedCards = []
    }

    playCard(cardIndex) {
        const playedCard = this.cards.splice(cardIndex, 1)[0]
        this.playedCards.push(playedCard)
        return playedCard
    }
}
