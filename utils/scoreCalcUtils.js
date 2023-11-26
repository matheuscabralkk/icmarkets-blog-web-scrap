/**
 * Returns the score
 * @param {Next24HoursBias} next24HoursBias
 * @returns {number}
 */
const getScoreByBias = (next24HoursBias) => {
    next24HoursBias = next24HoursBias?.trim().toLowerCase() || '';
    if (next24HoursBias.includes('strong')) return 3;
    if (next24HoursBias.includes('medium')) return 2;
    if (next24HoursBias.includes('weak') || next24HoursBias === 'bearish' || next24HoursBias === 'bullish') return 1;
    if (next24HoursBias.includes('mixed')) return 0;

    throw new Error(`Invalid next24HoursBias: ${next24HoursBias}`);
}


export const bullBearScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD - this case always will be a long - because the left symbol is bullish and the right symbol is bearish
    * left (EUR) = weak bullish = 1
    * right (USD) = weak bearish = 1
    * score = 1 + 1 = 2
    * scoreDirection = long
    * meaning: long EURUSD
     */
    const leftSymbolScore = getScoreByBias(leftSymbolNext24HoursBias);
    const rightSymbolScore = getScoreByBias(rightSymbolNext24HoursBias);
    const score = leftSymbolScore + rightSymbolScore;
    const scoreDirection = 'long';
    return {
        score,
        scoreDirection,
        leftSymbolScore,
        rightSymbolScore,
        leftSymbolDirection: 'bullish',
        rightSymbolDirection: 'bearish'
    };
}

export const bullBullScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = strong bullish = 3
    * right (USD) = weak bullish = 1
    * score = 3 - 1 = 2
    * scoreDirection = long
    * meaning: long EURUSD
    * 
    * CASE 2
    * left (EUR) = weak bullish = 1
    * right (USD) = strong bullish = 3
    * score = 1 - 3 = Math.abs(-2) = 2 - reversed because the left symbol is stronger than the right symbol
    * scoreDirection = short - because the left symbol is stronger than the right symbol
    * meaning: short EURUSD
    * 
    * CASE 3
    * left (EUR) = strong bullish = 3
    * right (USD) = strong bullish = 3
    * score = 3 - 3 = 0
    * scoreDirection = neutral
    * meaning: neutral EURUSD
    * */
    const leftSymbolScore = getScoreByBias(leftSymbolNext24HoursBias);
    const rightSymbolScore = getScoreByBias(rightSymbolNext24HoursBias);
    const score = Math.abs(leftSymbolScore - rightSymbolScore);
    let scoreDirection;
    if (leftSymbolScore > rightSymbolScore) {
        scoreDirection = 'long';
    } else if (leftSymbolScore < rightSymbolScore) {
        scoreDirection = 'short';
    } else {
        scoreDirection = 'neutral';
    }
    return {
        score,
        scoreDirection,
        leftSymbolScore,
        rightSymbolScore,
        leftSymbolDirection: 'bullish',
        rightSymbolDirection: 'bullish'
    };
}

export const bullNeutralScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = strong bullish = 3
    * right (USD) = neutral = 0
    * score = 3 + 0 = 3
    * scoreDirection = long
    * meaning: long EURUSD
     */
    const leftSymbolScore = getScoreByBias(leftSymbolNext24HoursBias);
    const score = leftSymbolScore;
    const scoreDirection = leftSymbolScore ? 'long' : 'short';
    return {
        score,
        scoreDirection,
        leftSymbolScore,
        rightSymbolScore: 0,
        leftSymbolDirection: 'bullish',
        rightSymbolDirection: 'neutral'
    };
}

export const bearBullScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD - this case always will be a short - because the left symbol is bearish and the right symbol is bullish
    * left (EUR) = weak bearish = 1
    * right (USD) = weak bullish = 1
    * score = 1 + 1 = 2
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const leftSymbolScore = getScoreByBias(leftSymbolNext24HoursBias);
    const rightSymbolScore = getScoreByBias(rightSymbolNext24HoursBias);
    const score = leftSymbolScore + rightSymbolScore;
    const scoreDirection = 'short';
    return {
        score,
        scoreDirection,
        leftSymbolScore,
        rightSymbolScore,
        leftSymbolDirection: 'bearish',
        rightSymbolDirection: 'bullish'
    };
}

export const bearBearScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = strong bearish = 3
    * right (USD) = weak bearish = 1
    * score = 3 - 1 = 2
    * scoreDirection = short
    * meaning: short EURUSD
    * 
    * CASE 2
    * left (EUR) = weak bearish = 1
    * right (USD) = strong bearish = 3
    * score = 1 - 3 = Math.abs(-2) = 2 - reversed because the left symbol is stronger than the right symbol
    * scoreDirection = long - because the left symbol is stronger than the right symbol
    * meaning: long EURUSD
    * 
    * CASE 3
    * left (EUR) = strong bearish = 3
    * right (USD) = strong bearish = 3
    * score = 3 - 3 = 0
    * scoreDirection = neutral
    * meaning: neutral EURUSD
    * */
    const leftSymbolScore = getScoreByBias(leftSymbolNext24HoursBias);
    const rightSymbolScore = getScoreByBias(rightSymbolNext24HoursBias);
    const score = Math.abs(leftSymbolScore - rightSymbolScore);
    let scoreDirection;
    if (leftSymbolScore > rightSymbolScore) {
        scoreDirection = 'short';
    } else if (leftSymbolScore < rightSymbolScore) {
        scoreDirection = 'long';
    } else {
        scoreDirection = 'neutral';
    }
    return {
        score,
        scoreDirection,
        leftSymbolScore,
        rightSymbolScore,
        leftSymbolDirection: 'bearish',
        rightSymbolDirection: 'bearish'
    };
}

export const bearNeutralScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = strong bearish = 3
    * right (USD) = neutral = 0
    * score = 3 + 0 = 3
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const leftSymbolScore = getScoreByBias(leftSymbolNext24HoursBias);
    const score = leftSymbolScore;
    const scoreDirection = !leftSymbolScore ? 'neutral' : 'short';
    return {
        score,
        scoreDirection,
        leftSymbolScore,
        rightSymbolScore: 0,
        leftSymbolDirection: 'bearish',
        rightSymbolDirection: 'neutral'
    };
}

export const neutralBullScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = neutral = 0
    * right (USD) = weak bullish = 1
    * score = 0 + 1 = 1
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const rightSymbolScore = getScoreByBias(rightSymbolNext24HoursBias);
    const score = rightSymbolScore;
    const scoreDirection = 'short';
    return {
        score,
        scoreDirection,
        leftSymbolScore: 0,
        rightSymbolScore,
        leftSymbolDirection: 'neutral',
        rightSymbolDirection: 'bullish'
    };
}

export const neutralBearScore = (leftSymbolNext24HoursBias, rightSymbolNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = neutral = 0
    * right (USD) = weak bearish = 1
    * score = 0 + 1 = 1
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const rightSymbolScore = getScoreByBias(rightSymbolNext24HoursBias);
    const score = rightSymbolScore;
    const scoreDirection = 'long';
    return {
        score,
        scoreDirection,
        leftSymbolScore: 0,
        rightSymbolScore,
        leftSymbolDirection: 'neutral',
        rightSymbolDirection: 'bearish'
    };
}

export const neutralNeutralScore = () => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = neutral = 0
    * right (USD) = neutral = 0
    * score = 0 + 0 = 0
    * scoreDirection = neutral
    * meaning: neutral EURUSD
     */
    return {
        score: 0,
        scoreDirection: 'neutral',
        leftSymbolScore: 0,
        rightSymbolScore: 0,
        leftSymbolDirection: 'neutral',
        rightSymbolDirection: 'neutral'
    };
}
