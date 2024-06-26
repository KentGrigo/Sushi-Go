function loadGame() {
    document.getElementById("form").submit()
    const numberOfPlayers = document.getElementById("numberOfPlayers").valueAsNumber
    if (!Number.isInteger(numberOfPlayers) || numberOfPlayers < 2 || 5 < numberOfPlayers) {
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
    console.log(players)

}
