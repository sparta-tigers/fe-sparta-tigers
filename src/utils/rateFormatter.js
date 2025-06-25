export const formatStars = (rate, max = 5) => {
    const filled = '★'.repeat(rate)
    const empty = '☆'.repeat(max - rate)
    return filled + empty
}
