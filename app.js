class Game {
    constructor(data) {
        this.id = data.id ?? null
        this.name = this.trimField(data.name) ?? ''
        this.price = data.price ?? null
        this.description = data.description ?? ''
        this.link = data.link ?? ''
        this.hashTags = this.flatHashTags(data.hashTags ?? [])
        this.discountType = data.discountType ?? null
    }

    trimField(field) {
        return field.trim('')
    }
    flatHashTags(hashTags) {
        return hashTags.flat(Infinity).join(',').split(',').filter((hashTag) => hashTag.length)
    }
}

const badGames = []
const games = filterGames(gamesList)
console.log(games);
console.log(badGames);

function filterGames(gamesList) {
    const games = gamesList.map(game => new Game({ ...game, price: priceValid(game.price) }))
    const filteredGames = games.filter(game => game.name && game.price ? game : fillBadGames(game))
    return filteredGames.map(game => {
        return new Game({ ...game, price: priceByDiscount(game.price, game.discountType) })
    })
}
function fillBadGames(invalidGame) {
    badGames.push(invalidGame)
}
function priceValid(price) {
    return (typeof price == 'string' || typeof price == 'number')
        && !isNaN(price - 0) 
        && price !== '' ? Number(Number(price).toFixed(2)) : null
}
function priceByDiscount(price, discountType) {
    const discountsList = createDiscountList(discounts)
    let priceByDiscount = price
    console.log(discountsList);

    if (discountType) {
        const currentDiscount = discountsList[discountType]
        const discountCondition = currentDiscount.cond
        const discountValue = currentDiscount.value

        if (discountCondition) {
            if (price - discountValue - discountCondition >= 0) {
                priceByDiscount = price - discountValue
            }
        } else if (price - currentDiscount > 0) {
            priceByDiscount = price - currentDiscount
        }
    }
    return priceByDiscount
}
function createDiscountList(discounts) {
    return discounts.reduce((acc, current) => {
        acc[current[0]] = current[1]
        return acc
    }, {})
}
