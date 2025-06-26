<script setup>
import instance from '@/axios.js'
import {onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {formatMatchTime} from "@/utils/index.js";

const chatRooms = ref([])
const page = ref(0)
const pageInfo = ref({})
const loading = ref(false)
const scrollContainer = ref(null)
const router = useRouter()

const fetchChatRooms = async (pageNum = 0) => {
  try {
    const response = await instance.get('direct-rooms', {
      params: {
        page: pageNum,
        size: 6,
      }
    });

    const {content, ...rest} = response.data.data;
    console.log(content);

    if (pageNum === 0) {
      chatRooms.value = content;
    } else {
      chatRooms.value = [...chatRooms.value, ...content];
    }

    pageInfo.value = rest;
    page.value = pageNum;

  } catch (e) {
    alert('채팅방 목록을 불러오는 중 문제가 발생했습니다! 잠시 후 다시 시도 해주세요!')
  } finally {
    loading.value = false;
  }
}

const navigateToChatRoom = (directRoomId, exchangeRequestId) => {
  router.push(`/exchange/chatrooms/${directRoomId}/exchangeRequest/${exchangeRequestId}`)
}

const loadNextPage = () => {
  if (!pageInfo.value.last && !loading.value) {
    fetchChatRooms(page.value + 1);
  }
}

const handleScroll = () => {
  if (!scrollContainer.value) return
  const {scrollTop, scrollHeight, clientHeight} = scrollContainer.value
  const threshold = 100 // 하단에서 100px 이내에 도달하면 로드

  if (scrollTop + clientHeight >= scrollHeight - threshold) {
    console.log('Loading next page...')
    loadNextPage()
  }
}

onMounted(async () => {
  await fetchChatRooms();

  setTimeout(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll)
    }
  }, 100)
})

</script>

<template>
  <div class="wrapper">
    <div v-if="loading && chatRooms.length === 0" class="loading">
      로딩 중...
    </div>
    <div v-else-if="chatRooms.length === 0" class="empty">
      교환 신청이 없습니다.
    </div>

    <div ref="scrollContainer" class="chatrooms-container">
      <div v-for="chatroom in chatRooms" :key="chatroom.directRoomId" class="chat-room-item"
           @click="() => navigateToChatRoom(chatroom.directRoomId, chatroom.exchangeRequestId)">

        <div class="item-image-container">
          <img :src="chatroom.itemImage" alt="아이템 이미지"/>
        </div>

        <div class="item-title-wrapper">
          <p class="title">{{ chatroom.itemTitle }}</p>
          <span class="createdAt">{{ formatMatchTime(chatroom.createdAt) }}</span>
        </div>

        <div class="opponent">
          <div class="nickname">신청자: {{ chatroom.opponentNickname }}</div>
          <div class="isOnline">{{ chatroom.opponentOnline ? 'Online' : 'Offline' }}</div>
        </div>

      </div>

      <div v-if="loading && chatRooms.length > 0" class="loading-more">
        더 불러오는 중...
      </div>
    </div>
  </div>
</template>

<style scoped>

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.loading, .empty {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
  font-size: 16px;
}

.chatrooms-container {
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chatrooms-container::-webkit-scrollbar {
  display: none;
}

.chat-room-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chat-room-item:hover {
  border-color: #659287;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.item-image-container {
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 8px;
  margin-right: 16px;
  flex-shrink: 0;
  border: 1px solid #e0e0e0;
}

.item-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-title-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.title {
  text-align: left;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.createdAt {
  font-size: 12px;
  color: #999;
}

.opponent {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.nickname {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.isOnline {
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f0f0f0;
  color: #666;
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

</style>