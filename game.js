function loadGame() {
    const numberOfPlayers = document.getElementById("numberOfPlayers").valueAsNumber
    const isValidNumberOfPlayers = Number.isInteger(numberOfPlayers) && 2 <= numberOfPlayers && numberOfPlayers <= 5
    if (!isValidNumberOfPlayers) {
        console.error("The number of players must be between 2 and 5, inclusive.")
        return
    }

    const numberOfStartingCards = {
        2: 10,
        3: 9,
        4: 8,
        5: 7,
    }[numberOfPlayers]

    const deck = new Deck()
    const players = []
    for (var playerNumber = 0; playerNumber < numberOfPlayers; playerNumber++) {
        const playerCards = deck.pop(numberOfStartingCards)
        const player = new Player(playerCards)
        players.push(player)
    }

    const messages = document.getElementById("messages")
    for (var cardNumber = 0; cardNumber < numberOfStartingCards; cardNumber++) {
        for (var playerNumber = 0; playerNumber < numberOfPlayers; playerNumber++) {
            const player = players[playerNumber]
            const playedCard = player.playCard(0)
            const message = `Player #${playerNumber} played ${playedCard.name}<br>`
            messages.innerHTML += message
        }

        const tmp = players[0].cards
        for (var playerNumber = 0; playerNumber < numberOfPlayers - 1; playerNumber++) {
            players[playerNumber].cards = players[playerNumber + 1].cards
        }
        players[numberOfPlayers - 1].cards = tmp
    }

    const score = new Score(players).calculateScore()
}
