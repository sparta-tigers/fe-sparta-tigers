<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import axios from '@/axios.js'
import {useWatchListStore} from "@/store/useWatchListStore.js";
import SchedulePopup from '@/page/mobile/watchlist/SchedulePopUp.vue'
import { formatMatchTime } from '@/utils'
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
  const formData = new FormData()
  formData.append('file', file)

  // 예시: S3 업로드 API 호출
  return axios.post('/watchlist/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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

        // 로딩 이미지 제거 후 실제 이미지 삽입
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
    match: { id: selectedMatch.value.matchId },
    record: { content, rate: rate.value },
    seat: seat.value,
  }

  try {
    await watchListStore.createWatchList(payload)
    alert('등록 완료!')
    await router.push({ name: 'record-main' })
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

onBeforeUnmount(() => {
  quill = null
})
</script>

<template>
  <div class="form-container">
    <div class="input-group">
      <input v-model="seat" placeholder="좌석 입력 ex)A12, A13 등" />
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

</style>
