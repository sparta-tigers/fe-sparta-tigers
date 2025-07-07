<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import axios from '@/axios.js'
import {useWatchListStore} from "@/store/useWatchListStore.js";
import SchedulePopup from '@/page/mobile/user/mypage/watchlist/SchedulePopUp.vue'
import {formatMatchTime} from '@/utils/index.js'
import router from "@/router/router.js";

const showMatchPopup = ref(false)
const editorContainer = ref(null)
let quill
const editorHeight = '700px'
const watchListStore = useWatchListStore()
const seat = ref('')
const rate = ref(5)
const selectedMatch = ref(null)

const openMatchPopup = () => {
  window.open(
      '/record/teams',
      'MatchPopup',
      'width=600,height=700'
  )
}
onMounted(() => {
  window.addEventListener('message', (event) => {
    const data = event.data
    if (data && data.matchId) {
      selectedMatch.value = data
      showMatchPopup.value = false
    }
  })
})

async function uploadImage(file) {
  const resizedFile = await resizeImage(file)

  const formData = new FormData()
  formData.append('file', resizedFile)

  // 예시: S3 업로드 API 호출
  return axios.post('/watchlist/uploads', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  }).then(res => {
    return res.data.data.imageUrl
  })
}

function imageHandler() {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('accept', 'image/*')
  input.click()

  input.onchange = async () => {
    const file = input.files[0]
    if (file) {
      try {
        const range = quill.getSelection(true)
        quill.insertEmbed(range.index, 'image', 'loading_spinner_url_or_blank')

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

const submit = async () => {
  const content = quill.root.innerHTML

  const isContentEmpty = (text) => !text || text === '<p><br></p>'

  if (isContentEmpty(content)) {
    alert('내용을 입력하세요.')
    return
  }

  const payload = {
    match: {id: selectedMatch.value.matchId},
    record: {content, rate: rate.value},
    seat: seat.value,
  }

  try {
    await watchListStore.createWatchList(payload)
    alert('등록 완료!')
    await router.push({name: 'record-main'})
  } catch (err) {
    console.error('등록 실패:', err)
    alert('등록 실패! 다시 시도해주세요.')
  }
}

onMounted(() => {
  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    placeholder: '내용을 입력하세요...',
    modules: {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{header: 1}, {header: 2}],
          [{list: 'ordered'}, {list: 'bullet'}],
          ['link', 'image'],
          ['clean']
        ],
        handlers: {
          image: imageHandler
        }
      }
    }
  })
})

async function resizeImage(file, maxWidth = 800, maxHeight = 800) {
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

      // 비율 유지하며 리사이징
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
        // 리사이징된 Blob을 File 객체로 변환
        const resizedFile = new File([blob], file.name, {type: file.type})
        resolve(resizedFile)
      }, file.type, 0.8) // 0.8은 이미지 품질 (JPEG 등)
    }

    img.onerror = reject

    reader.readAsDataURL(file)
  })
}

onBeforeUnmount(() => {
  quill = null
})
</script>

<template>
  <div class="form-container">
    <div class="input-group">
      <input v-model="seat" placeholder="좌석 입력 ex)A12, A13 등"/>
      <button @click="openMatchPopup">경기 선택</button>

      <SchedulePopup
          v-if="showMatchPopup"
          @close="showMatchPopup = false"
      />
    </div>

    <div v-if="selectedMatch" class="selected-match-box">
      <div class="match-label">선택한 경기</div>
      <div class="match-info">
        {{ selectedMatch.homeName }} vs {{ selectedMatch.awayName }} @ {{ selectedMatch.stadiumName }}
        ({{ formatMatchTime(selectedMatch.matchDate) }})
      </div>
    </div>


    <div class="rating-group">
      <span
          v-for="i in 5"
          :key="i"
          class="star"
          :class="{ filled: i <= rate }"
          @click="rate = i"
      >
        ★
      </span>
    </div>

    <div class="editor-wrapper">
      <div :style="{ height: editorHeight }" ref="editorContainer"></div>
    </div>

    <div class="submit-container">
      <button class="submit-button" @click="submit">직관 기록 등록하기</button>
    </div>
  </div>
</template>


<style scoped>
.form-container {
  max-width: 600px;
  margin: 30px auto;
  padding: 20px;
  background: #fdfdfd;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.input-group input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.input-group button {
  padding: 10px 14px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.rating-group {
  margin-bottom: 16px;
  font-size: 24px;
}

.star {
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star.filled {
  color: #f5a623;
}

.editor-wrapper {
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: white;
  max-height: 800px;
  overflow-y: auto;
}

.submit-container {
  margin-top: 24px;
  text-align: center;
}

.submit-button {
  padding: 10px 20px;
  background-color: #4f46e5;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #3730a3;
}

.ql-editor img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem auto;
  object-fit: contain;
  max-height: 400px;
}

</style>
