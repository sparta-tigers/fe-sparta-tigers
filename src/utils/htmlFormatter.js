/*
Editor 사용 시 HTML을 DB에서 전체 가져온다.
HTML 태그 제거 역할 (보여줄 때)
 */
export const stripHtml = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
}
