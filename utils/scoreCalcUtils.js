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


export const bullBearScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD - this case always will be a long - because the left currency is bullish and the right currency is bearish
    * left (EUR) = weak bullish = 1
    * right (USD) = weak bearish = 1
    * score = 1 + 1 = 2
    * scoreDirection = long
    * meaning: long EURUSD
     */
    const leftCurrencyScore = getScoreByBias(leftCurrencyNext24HoursBias);
    const rightCurrencyScore = getScoreByBias(rightCurrencyNext24HoursBias);
    const score = leftCurrencyScore + rightCurrencyScore;
    const scoreDirection = 'long';
    return {
        score,
        scoreDirection,
        leftCurrencyScore,
        rightCurrencyScore,
        leftCurrencyDirection: 'bullish',
        rightCurrencyDirection: 'bearish'
    };
}

export const bullBullScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
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
    * score = 1 - 3 = Math.abs(-2) = 2 - reversed because the left currency is stronger than the right currency
    * scoreDirection = short - because the left currency is stronger than the right currency
    * meaning: short EURUSD
    * 
    * CASE 3
    * left (EUR) = strong bullish = 3
    * right (USD) = strong bullish = 3
    * score = 3 - 3 = 0
    * scoreDirection = neutral
    * meaning: neutral EURUSD
    * */
    const leftCurrencyScore = getScoreByBias(leftCurrencyNext24HoursBias);
    const rightCurrencyScore = getScoreByBias(rightCurrencyNext24HoursBias);
    const score = Math.abs(leftCurrencyScore - rightCurrencyScore);
    let scoreDirection;
    if (leftCurrencyScore > rightCurrencyScore) {
        scoreDirection = 'long';
    } else if (leftCurrencyScore < rightCurrencyScore) {
        scoreDirection = 'short';
    } else {
        scoreDirection = 'neutral';
    }
    return {
        score,
        scoreDirection,
        leftCurrencyScore,
        rightCurrencyScore,
        leftCurrencyDirection: 'bullish',
        rightCurrencyDirection: 'bullish'
    };
}

export const bullNeutralScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = strong bullish = 3
    * right (USD) = neutral = 0
    * score = 3 + 0 = 3
    * scoreDirection = long
    * meaning: long EURUSD
     */
    const leftCurrencyScore = getScoreByBias(leftCurrencyNext24HoursBias);
    const score = leftCurrencyScore;
    const scoreDirection = leftCurrencyScore ? 'long' : 'short';
    return {
        score,
        scoreDirection,
        leftCurrencyScore,
        rightCurrencyScore: 0,
        leftCurrencyDirection: 'bullish',
        rightCurrencyDirection: 'neutral'
    };
}

export const bearBullScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD - this case always will be a short - because the left currency is bearish and the right currency is bullish
    * left (EUR) = weak bearish = 1
    * right (USD) = weak bullish = 1
    * score = 1 + 1 = 2
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const leftCurrencyScore = getScoreByBias(leftCurrencyNext24HoursBias);
    const rightCurrencyScore = getScoreByBias(rightCurrencyNext24HoursBias);
    const score = leftCurrencyScore + rightCurrencyScore;
    const scoreDirection = 'short';
    return {
        score,
        scoreDirection,
        leftCurrencyScore,
        rightCurrencyScore,
        leftCurrencyDirection: 'bearish',
        rightCurrencyDirection: 'bullish'
    };
}

export const bearBearScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
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
    * score = 1 - 3 = Math.abs(-2) = 2 - reversed because the left currency is stronger than the right currency
    * scoreDirection = long - because the left currency is stronger than the right currency
    * meaning: long EURUSD
    * 
    * CASE 3
    * left (EUR) = strong bearish = 3
    * right (USD) = strong bearish = 3
    * score = 3 - 3 = 0
    * scoreDirection = neutral
    * meaning: neutral EURUSD
    * */
    const leftCurrencyScore = getScoreByBias(leftCurrencyNext24HoursBias);
    const rightCurrencyScore = getScoreByBias(rightCurrencyNext24HoursBias);
    const score = Math.abs(leftCurrencyScore - rightCurrencyScore);
    let scoreDirection;
    if (leftCurrencyScore > rightCurrencyScore) {
        scoreDirection = 'short';
    } else if (leftCurrencyScore < rightCurrencyScore) {
        scoreDirection = 'long';
    } else {
        scoreDirection = 'neutral';
    }
    return {
        score,
        scoreDirection,
        leftCurrencyScore,
        rightCurrencyScore,
        leftCurrencyDirection: 'bearish',
        rightCurrencyDirection: 'bearish'
    };
}

export const bearNeutralScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = strong bearish = 3
    * right (USD) = neutral = 0
    * score = 3 + 0 = 3
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const leftCurrencyScore = getScoreByBias(leftCurrencyNext24HoursBias);
    const score = leftCurrencyScore;
    const scoreDirection = !leftCurrencyScore ? 'neutral' : 'short';
    return {
        score,
        scoreDirection,
        leftCurrencyScore,
        rightCurrencyScore: 0,
        leftCurrencyDirection: 'bearish',
        rightCurrencyDirection: 'neutral'
    };
}

export const neutralBullScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = neutral = 0
    * right (USD) = weak bullish = 1
    * score = 0 + 1 = 1
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const rightCurrencyScore = getScoreByBias(rightCurrencyNext24HoursBias);
    const score = rightCurrencyScore;
    const scoreDirection = 'short';
    return {
        score,
        scoreDirection,
        leftCurrencyScore: 0,
        rightCurrencyScore,
        leftCurrencyDirection: 'neutral',
        rightCurrencyDirection: 'bullish'
    };
}

export const neutralBearScore = (leftCurrencyNext24HoursBias, rightCurrencyNext24HoursBias) => {
    /*
    * CASE 1 - EURUSD
    * left (EUR) = neutral = 0
    * right (USD) = weak bearish = 1
    * score = 0 + 1 = 1
    * scoreDirection = short
    * meaning: short EURUSD
     */
    const rightCurrencyScore = getScoreByBias(rightCurrencyNext24HoursBias);
    const score = rightCurrencyScore;
    const scoreDirection = 'long';
    return {
        score,
        scoreDirection,
        leftCurrencyScore: 0,
        rightCurrencyScore,
        leftCurrencyDirection: 'neutral',
        rightCurrencyDirection: 'bearish'
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
        leftCurrencyScore: 0,
        rightCurrencyScore: 0,
        leftCurrencyDirection: 'neutral',
        rightCurrencyDirection: 'neutral'
    };
}
