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

    const players = []
    for (var playerNumber = 0; playerNumber < numberOfPlayers; playerNumber++) {
        const player = new Player(`Player #${playerNumber + 1}`)
        players.push(player)
    }

    const messages = document.getElementById("messages")
    const deck = new Deck()
    const numberOfRounds = 3
    for (var roundNumber = 0; roundNumber < numberOfRounds; roundNumber++) {
        messages.innerHTML += `Round number ${roundNumber + 1}<br>`
        messages.innerHTML += "<br>"
        startRound(deck, players, numberOfStartingCards, messages)
        messages.innerHTML += "-------<br>"
        messages.innerHTML += "<br>"
    }
}

function startRound(deck, players, numberOfStartingCards, messages) {
    players.forEach(player => {
        const playerCards = deck.pop(numberOfStartingCards)
        player.newCards(playerCards)
    })

    for (var cardNumber = 0; cardNumber < numberOfStartingCards; cardNumber++) {
        players.forEach(player => {
            const playedCard = player.playCard(0)
            const message = `${player.name} played ${playedCard.name}<br>`
            messages.innerHTML += message
        })
        messages.innerHTML += "<br>"

        swapPlayerCards(players)
    }

    const score = new Score(players).calculateScore()
    players.forEach(player => {
        const playerScore = score[player.id]
        messages.innerHTML += `${player.name}: ${playerScore["score"]}<br>`
    })
    messages.innerHTML += "<br>"
}

function swapPlayerCards(players) {
    const tmp = players[0].cards
    for (var playerNumber = 0; playerNumber < players.length - 1; playerNumber++) {
        players[playerNumber].cards = players[playerNumber + 1].cards
    }
    players[players.length - 1].cards = tmp
}
