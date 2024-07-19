class Score {
    constructor(players) {
        this.players = players
        this.playerIdToScore = {}
        this.players.forEach(player => {
            this.playerIdToScore[player.id] = {
                score: 0,
                numberOfMakiRolls: 0,
                numberOfTempura: 0,
                numberOfSashimi: 0,
                numberOfDumplings: 0,
                numberOfUnusedWasabi: 0,
                numberOfPudding: 0,
            }
        })
    }

    getNigiriBaseScore(playedCard) {
        switch (playedCard.constructor) {
            case SquidNigiri: return 3
            case SalmonNigiri: return 2
            case EggNigiri: return 1
            default: console.error(`Unsupported card: ${playedCard}`); return
        }
    }

    calculateNigiriScore(playedCard, score) {
        const baseScore = this.getNigiriBaseScore(playedCard)
        let extraScore = baseScore
        if (0 < score.numberOfUnusedWasabi) {
            score["numberOfUnusedWasabi"] -= 1
            extraScore *= 3
        }
        score["score"] += extraScore
    }

    calculateDumplingScore(score) {
        const numberOfDumplings = score["numberOfDumplings"]
        let modifier = 0
        let extraScore = 0
        for (var dumplingNumber = 0; dumplingNumber < numberOfDumplings; dumplingNumber++) {
            modifier += 1
            extraScore += modifier
        }
        score["score"] += extraScore
        score["numberOfDumplings"] = 0
    }

    calculateMakiRollScore() {
        const playerIdsAndMakiRolls =
            Object.keys(this.playerIdToScore)
                .map((playerId) => {
                    const playerScore = this.playerIdToScore[playerId]
                    const numberOfMakiRolls = playerScore["numberOfMakiRolls"]
                    return { "playerId": playerId, "numberOfMakiRolls": numberOfMakiRolls }
                })
                .sort(function (a, b) {
                    return a["numberOfMakiRolls"] < b["numberOfMakiRolls"] ? 1
                         : a["numberOfMakiRolls"] > b["numberOfMakiRolls"] ? -1
                         : 0
                })

        const mostMakiRolls = playerIdsAndMakiRolls[0]["numberOfMakiRolls"]
        if (mostMakiRolls === 0) return
        const playersIdsWithMostMakiRolls = playerIdsAndMakiRolls.filter(entry => mostMakiRolls === entry["numberOfMakiRolls"])

        const maxScore = 6
        const splitMaxScore = Math.floor(maxScore / playersIdsWithMostMakiRolls.length)
        playersIdsWithMostMakiRolls.forEach(entry => {
            const playerId = entry["playerId"]
            const playerScore = this.playerIdToScore[playerId]
            playerScore["score"] += splitMaxScore
        })

        // Might also be most, but in that case, we'll skip
        const secondMostMakiRolls = playerIdsAndMakiRolls[1]["numberOfMakiRolls"]
        if (secondMostMakiRolls === 0 || secondMostMakiRolls === mostMakiRolls) return
        const playersIdsWithSecondMostMakiRolls = playerIdsAndMakiRolls.filter(entry => secondMostMakiRolls === entry["numberOfMakiRolls"])

        const secondMaxScore = 3
        const splitSecondMaxScore = Math.floor(secondMaxScore / playersIdsWithSecondMostMakiRolls.length)
        playersIdsWithSecondMostMakiRolls.forEach(entry => {
            const playerId = entry["playerId"]
            const playerScore = this.playerIdToScore[playerId]
            playerScore["score"] += splitSecondMaxScore
        })

        // TODO: `numberOfMakiRolls` is not reset if one of the above returns are evaluated
        Object.keys(this.playerIdToScore).forEach(playerId => {
            const playerScore = this.playerIdToScore[playerId]
            playerScore["numberOfMakiRolls"] = 0
        })
    }

    calculateRoundScore() {
        this.players.forEach(player => {
            const playerScore = this.playerIdToScore[player.id]
            player.playedCards.forEach(playedCard => {
                switch (playedCard.constructor) {
                    case MakiRoll1: playerScore["numberOfMakiRolls"] += 1; break
                    case MakiRoll2: playerScore["numberOfMakiRolls"] += 2; break
                    case MakiRoll3: playerScore["numberOfMakiRolls"] += 3; break
                    case Tempura: playerScore["numberOfTempura"] += 1; break
                    case Sashimi: playerScore["numberOfSashimi"] += 1; break
                    case Dumpling: playerScore["numberOfDumplings"] += 1; break
                    case Wasabi: playerScore["numberOfUnusedWasabi"] += 1; break
                    case Pudding: playerScore["numberOfPudding"] += 1; break
                    case Chopsticks: break;
                    case SquidNigiri:
                    case SalmonNigiri:
                    case EggNigiri: this.calculateNigiriScore(playedCard, playerScore); break
                    default: console.error(`Unsupported card: ${playedCard}`)
                }
            })

            playerScore["numberOfUnusedWasabi"] = 0

            const numberOfTempuraPairs = Math.floor(playerScore["numberOfTempura"] / 2)
            playerScore["score"] += 5 * numberOfTempuraPairs
            playerScore["numberOfTempura"] = 0

            const numberOfSashimiSets = Math.floor(playerScore["numberOfSashimi"] / 3)
            playerScore["score"] += 10 * numberOfSashimiSets
            playerScore["numberOfSashimi"] = 0

            this.calculateDumplingScore(playerScore)
        })

        this.calculateMakiRollScore()

        return this.playerIdToScore
    }

    calculateGameScore() {
    }
}
