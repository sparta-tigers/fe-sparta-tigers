<script setup>
import {useRouter} from "vue-router";
import {ref} from "vue";
import instance from "@/axios.js";

const router = useRouter();

const navigateToMainPage = () => {
  router.push('/exchange');
}

const category = ref('TICKET');
const title = ref('');
const description = ref('');
const imageFile = ref(null);
const imageInput = ref(null);
const imagePreview = ref(null);

const onImageClick = () => {
  imageInput.value.click();
};

const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };

    reader.readAsDataURL(file);
  }
};

const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => reject(error),
        {enableHighAccuracy: true, timeout: 10000, maximumAge: 600000}
    );
  });
};

const submitExchange = async () => {
  if (!title.value.trim() || !description.value.trim()) {
    alert('제목과 설명을 모두 입력해주세요.');
    return;
  }

  try {
    const location = await getCurrentLocation();

    const requestData = {
      itemDto: {
        category: category.value,
        title: title.value,
        description: description.value
      },
      locationDto: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    };

    const formData = new FormData();
    formData.append('request', new Blob([JSON.stringify(requestData)], {
      type: 'application/json'
    }));

    if (imageFile.value) {
      formData.append('file', imageFile.value);
    }

    const response = await instance.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.status === 200 || response.status === 201) {
      alert('교환 등록이 완료되었습니다.');
      router.push('/exchange');
    }
  } catch (error) {
    console.error('교환 등록 실패:', error);
    // TODO Modal은 나중에 붙일 예정
    alert('교환 등록에 실패했습니다. 다시 시도해주세요.');
  }
};

</script>

<template>
  <div class="create-item-wrapper">
    <!--  상단 네비게이션 메뉴  -->
    <div class="top-nav-bar">
      <!--  뒤로 가기 버튼    -->
      <div class="back-button-wrapper">
        <button class="back-button" @click="navigateToMainPage">
          <svg fill="none" height="39" viewBox="0 0 40 39" width="40" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20.343 39C31.1126 39 39.843 30.2696 39.843 19.5C39.843 8.73045 31.1126 0 20.343 0C9.57347 0 0.843018 8.73045 0.843018 19.5C0.843018 30.2696 9.57347 39 20.343 39Z"
                fill="#A5A5A5"/>
            <path d="M23.343 10.5L14.343 19.5L23.343 28.5" stroke="white" stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="4"/>
          </svg>
        </button>
      </div>

      <!-- 교환 카테고리 체크박스 -->
      <div class="category-wrapper">
        <!--  체크 박스들    -->
        <label class="radio-button">
          <input v-model="category" name="category" type="radio" value="TICKET">
          <span class="radio-label">티켓 교환</span>
        </label>

        <label class="radio-button">
          <input v-model="category" name="category" type="radio" value="GOODS">
          <span class="radio-label">굿즈 교환</span>
        </label>
      </div>

      <!-- 공간 채우기용 -->
      <div class="right-placeholder"></div>
    </div>

    <div class="divider"></div>

    <!--  이미지 입력 폼  -->
    <div class="image-input-wrapper">
      <div class="camera-image-wrapper" @click="onImageClick">
        <img v-if="imagePreview" :src="imagePreview" alt="미리보기" class="preview-image"/>
        <svg v-else fill="none" height="51" viewBox="0 0 50 51" width="50" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M44.6429 13.6608H5.3572C3.38475 13.6608 1.78577 15.2917 1.78577 17.3036V42.8036C1.78577 44.8155 3.38475 46.4465 5.3572 46.4465H44.6429C46.6154 46.4465 48.2143 44.8155 48.2143 42.8036V17.3036C48.2143 15.2917 46.6154 13.6608 44.6429 13.6608Z"
              stroke="#000001" stroke-linecap="round" stroke-linejoin="round"/>
          <path
              d="M25 37.3393C28.9449 37.3393 32.1429 34.0773 32.1429 30.0535C32.1429 26.0297 28.9449 22.7678 25 22.7678C21.0551 22.7678 17.8572 26.0297 17.8572 30.0535C17.8572 34.0773 21.0551 37.3393 25 37.3393Z"
              stroke="#000001" stroke-linecap="round" stroke-linejoin="round"/>
          <path
              d="M33.9287 13.6607V8.19645C33.9287 7.2303 33.5524 6.30373 32.8826 5.62056C32.2129 4.93739 31.3045 4.55359 30.3572 4.55359H19.643C18.6958 4.55359 17.7874 4.93739 17.1176 5.62056C16.4478 6.30373 16.0715 7.2303 16.0715 8.19645V13.6607"
              stroke="#000001" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <input ref="imageInput" accept="image/*" hidden="hidden" type="file" @change="onImageChange"/>
    </div>


    <div class="title-wrapper">
      <h3>제목</h3>
      <div>
        <input v-model="title" class="title-input" placeholder="티켓 구역, 좌석 정보" type="text">
      </div>
    </div>

    <div class="description-wrapper">
      <h4>상세 설명</h4>
      <textarea v-model="description" class="description-input" placeholder="상세 내용을 입력 해주세요"/>
    </div>

    <div class="submit-button-wrapper">
      <button class="submit-button" @click="submitExchange">교환 등록</button>
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
  gap: 16px;
}

.top-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  height: auto;
  flex-wrap: wrap;
  row-gap: 8px;
}

.back-button-wrapper {
  flex: 0 0 auto;
}

.back-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  outline: none;
  border: none;
  background-color: transparent;
  cursor: pointer;
}

.category-wrapper {
  display: flex;
  gap: 12px;
  flex: 1 1 auto;
  justify-content: center;
  flex-wrap: wrap;
}

.right-placeholder {
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
}

.radio-button {
  min-width: 100px;
  width: auto;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.radio-button input {
  display: none;
}

.radio-button:has(input:checked) {
  background-color: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.radio-button:has(input:checked) .radio-label {
  color: white;
}

.divider {
  height: 1px;
  background-color: #D8D8D8;
}

.camera-image-wrapper {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.title-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-input {
  width: 100%;
  height: 36px;
  padding-left: 8px;
  border: 1px solid #868686;
  outline: none;
  border-radius: 10px;
}

.title-input:focus {
  border-color: #659287;
}

.description-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.description-input {
  flex-grow: 1;
  border: 1px solid #868686;
  outline: none;
  border-radius: 10px;
  padding: 8px;
  resize: none;
}

.submit-button-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.submit-button {
  width: 100%;
  height: 40px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border-radius: 20px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

@media (max-width: 480px) {
  .category-wrapper {
    flex-direction: row;
    gap: 8px;
    justify-content: center;
  }

  .radio-button {
    font-size: 13px;
    padding: 0 10px;
  }
}
</style>