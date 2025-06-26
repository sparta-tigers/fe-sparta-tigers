<script setup>
import {onBeforeUnmount, onMounted, ref} from "vue";
import instance from "@/axios.js";
import {useRouter} from "vue-router";

const exchangeRequests = ref([])
const page = ref(0)
const pageInfo = ref({})
const loading = ref(false)
const scrollContainer = ref(null)
const router = useRouter()

const fetchExchangeRequests = async (pageNum = 0) => {
  if (loading.value) return
  loading.value = true

  try {
    const response = await instance.get(`/exchanges/request/receive?page=${pageNum}&size=10`)
    const {content, ...rest} = response.data.data
    if (pageNum === 0) {
      exchangeRequests.value = content
    } else {
      exchangeRequests.value = [...exchangeRequests.value, ...content]
    }

    pageInfo.value = rest
    page.value = pageNum
  } catch (error) {
    alert('교환 신청 목록을 불러오는 중 문제가 발생했습니다! 잠시 후 다시 시도 해주세요!');
  } finally {
    loading.value = false
  }
}

const updateExchangeRequest = async (exchangeRequestId, status) => {
  try {
    await instance.patch(`/exchanges/request/${exchangeRequestId}`, {
      status: status
    });

    if (status === 'ACCEPTED') {
      router.push('/exchange/chatrooms')
    } else {
      router.push('/exchange')
    }

  } catch (error) {
    if (status === 'ACCEPTED') {
      alert('교환 신청을 수락 하는 중 에러가 발생 했습니다!')
    } else {
      alert('교환 신청을 거절 하는 중 에러가 발생 했습니다!')
    }
    console.log(error);
  }
}

const loadNextPage = () => {
  if (!pageInfo.value.last && !loading.value) {
    fetchExchangeRequests(page.value + 1)
  }
}

const handleScroll = () => {
  if (!scrollContainer.value) return

  const {scrollTop, scrollHeight, clientHeight} = scrollContainer.value
  const threshold = 100 // 하단에서 100px 이내에 도달하면 로드

  if (scrollTop + clientHeight >= scrollHeight - threshold) {
    loadNextPage()
  }
}

const navigateToItemDetailPage = (itemId) => {
  router.push(`/exchange/item/${itemId}`)
}

onMounted(async () => {
  await fetchExchangeRequests();
  // nextTick을 사용하여 DOM이 렌더링된 후 스크롤 이벤트 등록
  setTimeout(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll)
    }
  }, 100)
})

onBeforeUnmount(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll)
  }
})

</script>

<template>
  <div class="create-item-wrapper">


    <div ref="scrollContainer" class="exchange-list">
      <!--  TODO Style    -->
      <div v-if="loading && exchangeRequests.length === 0" class="loading">
        로딩 중...
      </div>
      <!--  TODO Style    -->
      <div v-else-if="exchangeRequests.length === 0" class="empty">
        교환 신청이 없습니다.
      </div>

      <div v-else class="requests-container">
        <div
            v-for="request in exchangeRequests"
            :key="request.id"
            class="request-item"
        >

          <div class="request-title">
            <h2 class="title" @click="() => navigateToItemDetailPage(request.itemId)">{{ request.title }}</h2>
            <div class="badge">{{ request.category }}</div>
          </div>


          <div class="request-item-right-box">
            <div class="user-createdat-wrapper">
              <div class="request-user-text-wrapper">
                <span>요청자</span><span class="request-user">{{ request.sender.userNickname }}</span>
              </div>
            </div>

            <div class="button-wrapper">
              <button class="accept-button" @click="() => updateExchangeRequest(request.exchangeRequestId, 'ACCEPTED')">
                수락
              </button>
              <button class="reject-button" @click="() => updateExchangeRequest(request.exchangeRequestId, 'REJECTED')">
                거절
              </button>
            </div>
          </div>

        </div>

        <div v-if="loading && exchangeRequests.length > 0" class="loading-more">
          더 불러오는 중...
        </div>
      </div>
    </div>
  </div>


</template>

<style scoped>

.create-item-wrapper {
  border: 1px solid black;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.exchange-list {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.request-item {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  padding: 16px 0;
}

.request-title {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  padding-left: 16px;
  cursor: pointer;
}

.request-title .title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  vertical-align: middle;
  margin: 0;
  padding: 0;
}

.request-item-right-box {
  display: flex;
  gap: 24px;
}

.user-createdat-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
}

.request-user-text-wrapper {
  display: flex;
  flex-direction: row;
  gap: 4px;
}

.request-user {
  font-weight: bold;
}

.button-wrapper {
  display: flex;
  gap: 16px;
}

.badge {
  padding: 4px 8px;
  border-radius: 8px;
  background-color: #659287;
  font-size: 12px;
  color: white;
}

.accept-button {
  height: 40px;
  padding: 10px 20px;
  background-color: #659287;
  color: white;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.reject-button {
  height: 40px;
  padding: 10px 20px;
  background-color: white;
  color: #659287;
  border-radius: 12px;
  border: 1px solid #659287;
  font-weight: bold;
  outline: none;
  cursor: pointer;
}

</style>