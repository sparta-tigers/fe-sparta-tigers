<script setup>
import Location from "@/components/exchange/Location.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const routeCreateExchangePage = () => {
  router.push({name: 'create-exchange'});
}

const routeExchangeRequestListPage = () => {
  router.push({name: 'exchange-requests'});
}

const routeChatRoomsPage = () => {
  router.push({name: 'exchange-chatrooms'});
}

</script>

<template>
  <div class="root-wrapper">
    <div class="map-wrapper">
      <Location/>
    </div>
    <div class="button-wrapper">
      <button class="exchange-button" @click="routeCreateExchangePage">교환 등록하기</button>
      <button class="exchange-button" @click="routeChatRoomsPage">채팅 목록</button>
      <button class="exchange-button" @click="routeExchangeRequestListPage">교환 신청 목록</button>
    </div>
  </div>
</template>

<style scoped>

.root-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-wrapper {
  flex: 1;
}

.button-wrapper {
  position: fixed;
  bottom: 56px; /* Footer 높이만큼 위로 */
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 700px;
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 40px 40px 0 0;
  border-top: 1px solid gray;
  gap: 20px;
  z-index: 98;
}

.exchange-button {
  height: 40px;
  padding: 10px 20px;
  background-color: #659287;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

</style>