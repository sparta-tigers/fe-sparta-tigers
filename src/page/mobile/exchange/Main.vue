<script setup>
import Location from "@/components/exchange/Location.vue";
import {useRouter} from "vue-router";

const router = useRouter();

const routeCreateExchangePage = () => {
  router.push('/exchange/create');
}

const routeExchangeRequestListPage = () => {
  router.push('/exchange/requests');
}

const routeChatRoomsPage = () => {
  router.push('/exchange/chatrooms');
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
  height: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 40px 40px 0px 0px;
  border-top: 1px solid gray;
  gap: 20px;
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