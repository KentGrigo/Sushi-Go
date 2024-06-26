class Deck {
    constructor() {
        this.cards = this.shuffleFisherYates([
            ...this.instantiateCards(Tempura, 14),
            ...this.instantiateCards(Sashimi, 14),
            ...this.instantiateCards(Dumpling, 14),
            ...this.instantiateCards(MakiRoll3, 12),
            ...this.instantiateCards(MakiRoll2, 8),
            ...this.instantiateCards(MakiRoll1, 6),
            ...this.instantiateCards(SalmonNigiri, 10),
            ...this.instantiateCards(SquidNigiri, 5),
            ...this.instantiateCards(EggNigiri, 5),
            ...this.instantiateCards(Pudding, 10),
            ...this.instantiateCards(Wasabi, 6),
            ...this.instantiateCards(Chopsticks, 4),
        ])
        console.log(this.cards)
    }

    pop(numberOfCards) {
        const poppedCards = []
        for (var cardNumber = 0; cardNumber < numberOfCards; cardNumber++) {
            const poppedCard = this.cards.pop()
            poppedCards.push(poppedCard)
        }
        return poppedCards
    }

    instantiateCards(cardType, numberOfCards) {
        const newCards = []
        for (var cardNumber = 0; cardNumber < numberOfCards; cardNumber++) {
            const newCard = new cardType()
            newCards.push(newCard)
        }
        return newCards
    }

    shuffleFisherYates(array) {
        let index = array.length
        while (index--) {
            const randomIndex = Math.floor(Math.random() * index);
            this.swap(array, index, randomIndex)
        }
        return array
    }

    swap(array, index1, index2) {
        const tmp = array[index1]
        array[index1] = array[index2]
        array[index2] = tmp
    }
}
