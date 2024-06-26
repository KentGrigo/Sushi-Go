const numberOfPlayers = 3 // Range: 2 - 5
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
