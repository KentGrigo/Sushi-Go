class Score {
    constructor(players) {
        this.players = players
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

    calculateMakiRollScore(playerIdToScore) {
        const playerIdsAndMakiRolls =
            Object.keys(playerIdToScore)
                .map((playerId) => {
                    const score = playerIdToScore[playerId]
                    const numberOfMakiRolls = score["numberOfMakiRolls"]
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
            const score = playerIdToScore[playerId]
            score["score"] = splitMaxScore
        })

        // Might also be most, but in that case, we'll skip
        const secondMostMakiRolls = playerIdsAndMakiRolls[1]["numberOfMakiRolls"]
        if (secondMostMakiRolls === 0 || secondMostMakiRolls === mostMakiRolls) return
        const playersIdsWithSecondMostMakiRolls = playerIdsAndMakiRolls.filter(entry => secondMostMakiRolls === entry["numberOfMakiRolls"])

        const secondMaxScore = 3
        const splitSecondMaxScore = Math.floor(secondMaxScore / playersIdsWithSecondMostMakiRolls.length)
        playersIdsWithSecondMostMakiRolls.forEach(entry => {
            const playerId = entry["playerId"]
            const score = playerIdToScore[playerId]
            score["score"] = splitSecondMaxScore
        })

        // TODO: `numberOfMakiRolls` is not reset if one of the above returns are evaluated
        Object.keys(playerIdToScore).forEach(playerId => {
            const score = playerIdToScore[playerId]
            score["numberOfMakiRolls"] = 0
        })
    }

    calculateScore() {
        const playerIdToScore = {}
        this.players.forEach(player => {
            playerIdToScore[player.id] = {
                score: 0,
                numberOfMakiRolls: 0,
                numberOfTempura: 0,
                numberOfSashimi: 0,
                numberOfDumplings: 0,
                numberOfUnusedWasabi: 0,
                numberOfPudding: 0,
            }
        })
        this.players.forEach(player => {
            const score = playerIdToScore[player.id]
            player.playedCards.forEach(playedCard => {
                console.log(playedCard.name)
                switch (playedCard.constructor) {
                    case MakiRoll1: score["numberOfMakiRolls"] += 1; break
                    case MakiRoll2: score["numberOfMakiRolls"] += 2; break
                    case MakiRoll3: score["numberOfMakiRolls"] += 3; break
                    case Tempura: score["numberOfTempura"] += 1; break
                    case Sashimi: score["numberOfSashimi"] += 1; break
                    case Dumpling: score["numberOfDumplings"] += 1; break
                    case Wasabi: score["numberOfUnusedWasabi"] += 1; break
                    case Pudding: score["numberOfPudding"] += 1; break
                    case Chopsticks: break;
                    case SquidNigiri:
                    case SalmonNigiri:
                    case EggNigiri: this.calculateNigiriScore(playedCard, score); break
                    default: console.error(`Unsupported card: ${playedCard}`)
                }
            })

            const numberOfTempuraPairs = Math.floor(score["numberOfTempura"] / 2)
            score["score"] += 5 * numberOfTempuraPairs
            score["numberOfTempura"] = 0

            const numberOfSashimiSets = Math.floor(score["numberOfSashimi"] / 3)
            score["score"] += 10 * numberOfSashimiSets
            score["numberOfSashimi"] = 0

            this.calculateDumplingScore(score)
        })

        this.calculateMakiRollScore(playerIdToScore)

        console.log(playerIdToScore)

        return playerIdToScore
    }
}
