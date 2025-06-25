export const formatMatchTime = (isoString) => {
    if (!isoString) return ''

    const date = new Date(isoString)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')

    const period = hours >= 12 ? '오후' : '오전'
    hours = hours % 12 || 12

    return `${year}-${month}-${day} ${period} ${hours}:${minutes}`
}
