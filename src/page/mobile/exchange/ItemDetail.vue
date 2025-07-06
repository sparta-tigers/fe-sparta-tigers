<script setup>
import {onMounted, ref, toRaw} from "vue";
import {useUserStore} from "@/store/useUserStore.js";
import {useRoute, useRouter} from "vue-router";
import instance from '@/axios.js'
import {formatMatchTime} from '@/utils/dateFormatter.js'

const store = useUserStore()
const route = useRoute()
const router = useRouter()

const itemId = route.params.itemId
const item = ref(null)


// receiverId, itemId

const fetchItem = async () => {
  if (!itemId) {
    alert('잘못된 경로입니다!')
    router.push('/')
    return;
  }

  try {
    const response = await instance.get(`/items/${itemId}`)
    item.value = response.data.data;
  } catch (e) {
    console.log(e)
    alert('예상하지 못한 예외가 발생 했습니다!');
    router.push('/')
    return;
  }
}

const onExchangeRequestButtonClick = () => {
  const rawItem = toRaw(item.value)
  const rawUser = toRaw(store.user)

  if (rawUser.id === rawItem.user.userId) {
    alert('교환은 다른 사람과 가능합니다!');
    return;
  }
  try {
    instance.post('/exchanges/request', {
      receiverId: rawItem.user.userId,
      itemId: rawItem.id,
    })
    alert('교환 신청 완료!')
  } catch (e) {
    alert('교환 요청을 보내는데 실패했습니다! 잠시 후 다시 시도해주세요!');
  }
}

const onDeleteButtonClick = async () => {
  const rawItem = toRaw(item.value)
  const rawUser = toRaw(store.user)

  if (rawUser.id !== rawItem.user.userId) {
    alert('작성자만 삭제 할 수 있습니다!');
    return;
  }

  try {
    await instance.delete(`/items/${rawItem.id}`)
    alert('삭제가 완료 되었습니다!');
    router.push('/exchange');
  } catch (e) {
    alert('아이템 삭제중 문제가 발생 했습니다!');
    router.push('/exchange')
  }

  console.log(rawItem);

}

onMounted(async () => {
  await store.getUser();

  await fetchItem();
})

</script>

<template>
  <div v-if="item" class="item-detail-wrapper">
    <div class="item-detail-image-wrapper">
      <img :src="item.image" alt="item-image"/>
    </div>
    <div class="item-detail-title">
      <h1>{{ item.title }}</h1>
      <button class="delete-btn" @click="onDeleteButtonClick">삭제 하기</button>
    </div>
    <div class="item-detail-meta-wrapper">
      <div class="badge">{{ item.status }}</div>
      <div class="badge">{{ item.category }}</div>
    </div>

    <div class="item-detail-description-wrapper">
      <div>{{ item.description }}</div>
    </div>

    <div class="item-detail-author-wrapper">
      <div><span>작성자</span> <span class="username">{{ item.user.userNickname }}</span></div>
      <div>{{ formatMatchTime(item.createdAt) }}</div>
    </div>
    <div class="exchange-request-button-wrapper">
      <button @click="onExchangeRequestButtonClick">교환 신청 하기</button>
    </div>
  </div>
</template>

<style scoped>

.item-detail-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px;
}

.item-detail-image-wrapper {
  height: 250px;
}

.item-detail-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-detail-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  padding: 16px 0;
}

.item-detail-meta-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  gap: 8px;
  padding: 8px;
  margin-bottom: 8px;
}

.badge {
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #659287;
  color: white;
}

.item-detail-description-wrapper {
  padding: 8px;
  flex: 1;
  border: 1px solid lightgray;
  border-radius: 8px;
  margin-bottom: 4px;
}

.item-detail-author-wrapper {
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 4px;
}

.item-detail-author-wrapper .username {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.item-detail-author-wrapper > div:last-child {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

.exchange-request-button-wrapper {
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.exchange-request-button-wrapper button {
  padding: 8px;
  border-radius: 8px;
  background-color: #659287;
  color: white;
  border: none;
  cursor: pointer;
  width: 100%;
}

.delete-btn {
  padding: 8px;
  border-radius: 8px;
  background-color: #659287;
  color: white;
  border: none;
  cursor: pointer;
}

</style>