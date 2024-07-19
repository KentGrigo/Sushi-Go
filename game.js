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

    const messages = document.getElementById('messages')
    const deck = new Deck()
    const score = new Score(players)

    const numberOfRounds = 3
    for (var roundNumber = 0; roundNumber < numberOfRounds; roundNumber++) {
        writeMessage(messages, `Round number ${roundNumber + 1}`)
        writeMessage(messages, '')

        playRound(deck, players, numberOfStartingCards, messages)
        score.calculateRoundScore()

        writeScore(messages, players, score)
        writeMessage(messages, '-------')
        writeMessage(messages, '')
    }

    score.calculateGameScore()
    writeScore(messages, players, score)
}

function playRound(deck, players, numberOfStartingCards, messages) {
    players.forEach(player => {
        const playerCards = deck.pop(numberOfStartingCards)
        player.newCards(playerCards)
    })

    for (var cardNumber = 0; cardNumber < numberOfStartingCards; cardNumber++) {
        players.forEach(player => {
            const playedCard = player.playCard(0)
            writeMessage(messages, `${player.name} played ${playedCard.name}`)
        })
        writeMessage(messages, '')

        swapPlayerCards(players)
    }
}

function swapPlayerCards(players) {
    const tmp = players[0].cards
    for (var playerNumber = 0; playerNumber < players.length - 1; playerNumber++) {
        players[playerNumber].cards = players[playerNumber + 1].cards
    }
    players[players.length - 1].cards = tmp
}

function writeMessage(messages, message) {
    messages.innerHTML += `${message}<br>`
}

function writeScore(messages, players, score) {
    players.forEach(player => {
        const playerScore = score.playerIdToScore[player.id]
        writeMessage(messages, `${player.name}: ${playerScore['score']}`)
    })
    writeMessage(messages, '')
}
