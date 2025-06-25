<script setup>
import {KakaoMap, KakaoMapMarker} from "vue3-kakao-maps";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {useUserStore} from "@/store/useUserStore.js";
import {Client} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import instance from "@/axios.js"

// userStore
const store = useUserStore();

// 초기 위치
const coordinate = {
  lat: 33.450701,
  lng: 126.570667
};

// 반응형 데이터
const mapRef = ref(null);
const stompClient = ref(null);

// [id, user, category{GOODS, TICKET ENUM}, status:{REGISTERED, COMPLETED, FAILED}, createdAt]]
const userItems = ref({});
const subscription = ref(null);
const locationInterval = ref(null);

// 지도 관련 데이터
// [id, image, lat, lng, title, ]
const markers = ref([]);
// key: userId, {latitude, longitude};
const userLocations = ref({});

// 사용자 정보 가져오기
// store.user = {id, email, nickname, profilePath, imageSrc, imageWidth, imageHeight, title, isMe}
const fetchUser = async () => {
  await store.getUser();
}

onMounted(fetchUser);

// 웹 소켓 관련
const connectWebSocket = () => {
  if (store.user.id === undefined || store.user.id === null) return;

  stompClient.value = new Client({
    brokerURL: "ws://localhost:8080/ws",
    connectHeaders: {},
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
  });

  stompClient.value.onConnect = () => {
    // 여기를 바꾼다
    const userSpecificTopic = `/server/items/user/${store.user.id}`;

    subscription.value = stompClient.value.subscribe(userSpecificTopic, (message) => {
      handleRealtimeMessage(JSON.parse(message.body));
    })

    startSendingLocation();
  }

  stompClient.value.activate();
}
// 웹소켓 연결 해제
const disconnectWebSocket = () => {
  stopSendingLocation();

  if (stompClient) {
    console.log('웹소켓 연결을 해제합니다.');
    stompClient.value.deactivate();
  }
};

// 수신된 메시지를 타입별로 처리하는 핸들러
const handleRealtimeMessage = (message) => {
  console.log(`메시지 수신: ${JSON.stringify(message)}`);
  switch (message.type) {
    case 'ADD_ITEM':
      drawItemMarker(message.data);
      break;
    case 'REFRESH_ITEMS':
      fetchAndDrawItems();
      break;
    case 'USER_LOCATION_UPDATE':
      updateUserMarker(message.data.userId.toString(), message.data.latitude, message.data.longitude);
      break;
    case 'REMOVE_ITEM':
      handleItemRemoval(message.data.userId.toString());
      break;
    default:
      console.warn('알수 없는 메시지 타입:', message.type);
  }
}

// 2. 주변 아이템 목록을 불러와 마커를 그리는 함수
const fetchAndDrawItems = async () => {
  try {
    const response = await instance.get('/items');
    const items = response.data.data.content;
    console.log(`주변 아이템: [${JSON.stringify(items)}]`)
    items.forEach(item => drawItemMarker(item));
  } catch (error) {
    console.log('주변 아이템 로드 실패:', error);
  }
}

// 3. 아이템을 가지고 와서 마커를 그린다.
// 아이템 마커는 사용자 아이디랑 같이 뜬다.
const drawItemMarker = (item) => {
  const itemOwnerId = item.user.userId.toString();
  userItems.value[itemOwnerId] = item;
  // TODO 여기에 데이터 어떻게 들어가지
  const ownerLocation = userLocations.value[itemOwnerId];
  if (ownerLocation) {
    updateUserMarker(itemOwnerId, ownerLocation.latitude, ownerLocation.longitude);
  }
}

// 마커 업데이트 생성 함수
const updateUserMarker = (userId, latitude, longitude) => {
  const isMe = store.user.id === userId;
  const item = userItems.value[userId];

  // 마커 이미지 결정
  let imageSrc = '';
  if (item) {
    // 아이템인경우 TODO 이미지 옮겨와야 함
    if (item.category === 'TICKET') {
      imageSrc = '/ticket.png';
    } else if (item.category === 'GOODS') {
      imageSrc = '/goods.avif';
    }
  } else {
    // 아이템이 아닌 경우
    imageSrc = isMe ?
        'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png' :
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png';
  }

  // 기존 마커 찾기
  const existingMarkerIndex = markers.value.findIndex(marker => marker.id === userId);
  // 마커에 넣을 데이터
  const markerData = {
    id: userId,
    lat: latitude,
    lng: longitude,
    imageSrc: imageSrc,
    imageWidth: item ? 35 : (isMe ? 24 : 19),
    imageHeight: item ? 35 : (isMe ? 35 : 30),
    title: `User ${userId}`,
    isMe: isMe
  };

  if (existingMarkerIndex !== -1) {
    // 기존 마커 업데이트
    markers.value[existingMarkerIndex] = markerData;
  } else {
    // 새 마커 추가
    markers.value.push(markerData);
  }

  // 내 위치면 지도 중심 이동
  if (isMe) {
    if (mapRef.value) {
      mapRef.value.setCenter(new kakao.maps.LatLng(latitude, longitude));
    }
  }

  userLocations.value[userId] = {latitude, longitude};
}

// 유저가 아이템을 삭제하면 Stomp를 통해 호출되는 함수
// userItem이 존재하면 지워주고, userLocations에는 userKey값으로 위경도 위치가 있는데 지워주고
// TODO 근데 여기는 무조건 아이템일건데, 여기 로직 좀 손봐야 할 듯
// TODO 근데 지금 마커를 저장할때 아이템아이디가 아니라 무조건 유저아이디 기반이네?
// TODO 아 기획대로라면 유저위치랑 아이템 마커위치가 같아야지 같은 사람이 올린거라면
const handleItemRemoval = (userId) => {
  if (userItems.value[userId]) {
    delete userItems[userId];
  }

  const ownerLocation = userLocations.value[userId];
  if (ownerLocation) {
    updateUserMarker(userId, ownerLocation.latitude, ownerLocation.longitude);
  }
}

const startSendingLocation = () => {
  const sendCurrentLocation = () => {

    navigator.geolocation.getCurrentPosition(
        (position) => {
          const {latitude, longitude} = position.coords;
          updateUserMarker(store.user.id, latitude, longitude);

          if (stompClient.value && stompClient.value.connected) {
            stompClient.value.publish({
              destination: '/client/location.update',
              body: JSON.stringify({latitude, longitude}),
            });
          }
        },
        (error) => {
          console.log('위치 가져오기 실패!');
          console.log(error);
        },
        {enableHighAccuracy: true}
    );
  }

  sendCurrentLocation();
  if (locationInterval.value) clearInterval(locationInterval.value);
  locationInterval.value = setInterval(sendCurrentLocation, 3000);
}

const stopSendingLocation = () => {
  if (locationInterval.value) {
    clearInterval(locationInterval.value);
    locationInterval.value = null;
  }
}

onBeforeUnmount(() => {
  disconnectWebSocket();
});

// 1. 지도가 로드되면 가장 먼저 아이템을 조회한다.
const onLoadKakaoMap = async (ref) => {
  mapRef.value = ref;
  await fetchAndDrawItems();
  connectWebSocket();
};

// TODO 주요 이벤트
// onLoadKakaoMap 지도가 로드되었을 때 발생하는 이벤트
// onLoadKakaoMapMarkerCluster 지도의 마커 클러스터가 로드되었을때 발생하는 이벤트

</script>

<template>
  <div class="map-container">
    <KakaoMap :draggable="true"
              :lat="coordinate.lat"
              :lng="coordinate.lng"
              style="width: 100%; height: 100%;"
              @onLoadKakaoMap="onLoadKakaoMap">
      <KakaoMapMarker
          v-for="marker in markers"
          :key="marker.id"
          :image="{
          imageSrc: marker.imageSrc,
          imageWidth: marker.imageWidth,
          imageHeight: marker.imageHeight
        }"
          :lat="marker.lat"
          :lng="marker.lng"
          :title="marker.title"
      />
    </KakaoMap>
    <div id="map">
    </div>
  </div>

</template>


<style scoped>

.map-container {
  width: 100%;
  height: 100%;
}
</style>
