import Quill from 'quill'
import axios from '@/axios.js'

export async function resizeImage(file, maxWidth = 800, maxHeight = 800) {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const canvas = document.createElement('canvas')
        const reader = new FileReader()

        reader.onload = e => {
            img.src = e.target.result
        }
        reader.onerror = reject

        img.onload = () => {
            let width = img.width
            let height = img.height

            if (width > maxWidth || height > maxHeight) {
                const aspectRatio = width / height
                if (width > height) {
                    width = maxWidth
                    height = Math.round(maxWidth / aspectRatio)
                } else {
                    height = maxHeight
                    width = Math.round(maxHeight * aspectRatio)
                }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            ctx.clearRect(0, 0, width, height)
            ctx.drawImage(img, 0, 0, width, height)

            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('이미지 리사이징 실패'))
                    return
                }
                const resizedFile = new File([blob], file.name, { type: file.type })
                resolve(resizedFile)
            }, file.type, 0.8)
        }

        img.onerror = reject

        reader.readAsDataURL(file)
    })
}

export async function imageHandler(quillInstance, uploadImage) {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.setAttribute('accept', 'image/*')
    input.click()

    input.onchange = async () => {
        const file = input.files[0]
        if (file) {
            try {
                const range = quillInstance.getSelection(true)
                quillInstance.insertEmbed(range.index, 'image', 'loading_spinner_url_or_blank')

                const imageUrl = await uploadImage(file)

                quill.deleteText(range.index, 1)
                quill.insertEmbed(range.index, 'image', imageUrl)
                quill.setSelection(range.index + 1)
            } catch (error) {
                console.error('이미지 업로드 실패:', error)
            }
        }
    }
}


export async function uploadImage(file) {
    const resizedFile = await resizeImage(file)

    const formData = new FormData()
    formData.append('file', resizedFile)

    // S3 업로드 API 호출 예시
    return axios.post('/watchlist/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }).then(res => {
        return res.data.data.imageUrl
    })
}

export function createQuillInstance(container, imageHandler) {
    return new Quill(container, {
        theme: 'snow',
        placeholder: '내용을 입력하세요...',
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        },
    })
}
