<template>
  <div v-if="watchListStore.watchlistDetail" class="record-detail-container">
    <!-- 경기 정보 -->
    <section>
      <h3>경기 정보</h3>
    </section>

    <!-- 내용 -->
    <section class="content-section">
      <h3>내용</h3>
      <div v-if="!editing" class="rich-html-content" v-html="watchListStore.watchlistDetail.record.content"></div>
      <div v-else>
        <div ref="editorContainer" class="editor-box"></div>
        <div class="rating-group">
          <span
              v-for="i in 5"
              :key="i"
              class="star"
              :class="{ filled: i <= editRate }"
              @click="editRate = i"
          >★</span>
        </div>
      </div>
    </section>

    <!-- 평점 -->
    <section>
      <p>평점: {{ editing ? formatStars(editRate) : formatStars(watchListStore.watchlistDetail.record.rate) }}</p>
    </section>

    <!-- 등록일 -->
    <section>
      <p>등록일: {{ formatMatchTime(watchListStore.watchlistDetail.createdAt) }}</p>
    </section>

    <!-- 버튼 -->
    <section class="action-buttons">
      <template v-if="!editing">
        <SubBtn @click="onEdit" label="수정" />
        <CancelBtn @click="onDelete" label="삭제" />
      </template>
      <template v-else>
        <CancelBtn @click="onCancelEdit" label="취소" />
        <SubBtn @click="onSaveEdit" label="저장" />
      </template>
    </section>
  </div>
  <div v-else>로딩중...</div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWatchListStore } from '@/store/useWatchListStore.js'
import { formatMatchTime, formatStars } from '@/utils'
import SubBtn from "@/components/btn/SubBtn.vue"
import CancelBtn from "@/components/btn/CancelBtn.vue"
import Quill from 'quill'

const route = useRoute()
const router = useRouter()
const watchListStore = useWatchListStore()

const editing = ref(false)
const editorContainer = ref(null)
let quill = null
const editContent = ref('')
const editRate = ref(5)

onMounted(async () => {
  await watchListStore.fetchWatchListDetail(route.params.id)
})

const onEdit = async () => {
  editing.value = true
  editContent.value = watchListStore.watchlistDetail.record.content || ''
  editRate.value = watchListStore.watchlistDetail.record.rate || 5

  await nextTick()
  quill = new Quill(editorContainer.value, {
    theme: 'snow',
    placeholder: '내용을 입력하세요...',
    modules: {
      toolbar: [['bold', 'italic', 'underline'], [{ header: 1 }, { header: 2 }], ['link', 'image'], ['clean']]
    }
  })
  quill.root.innerHTML = editContent.value
}

const onCancelEdit = () => {
  editing.value = false
  quill = null
}

const onSaveEdit = async () => {
  const updatedContent = quill.root.innerHTML
  try {
    await watchListStore.updateWatchList(route.params.id, {
      content: updatedContent,
      rate: editRate.value
    })
    await watchListStore.fetchWatchListDetail(route.params.id)
    editing.value = false
    alert('수정 완료!')
  } catch (e) {
    alert('수정 실패')
  }
}

const onDelete = async () => {
  if (!confirm('정말 삭제하시겠습니까?')) return
  try {
    await watchListStore.deleteWatchList(route.params.id)
    alert('삭제되었습니다.')
    await router.push({name: 'record-main'})
  } catch {
    alert('삭제 실패')
  }
}
</script>

<style scoped>
.record-detail-container {
  max-width: 700px;
  margin: 2rem auto;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 1rem;
  background-color: #fafafa;
}
.content-section {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 0.8rem;
  margin: 1rem 0 2rem 0;
  background-color: #fff;
  max-height: 800px;
  overflow-y: auto;
}
.editor-box {
  max-width: 800px;
  margin: auto;
}
.rating-group {
  font-size: 24px;
  margin-top: 0.5rem;
}
.star {
  cursor: pointer;
  color: #ddd;
}
.star.filled {
  color: #f5a623;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>
