<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useUserStore} from '@/store/useUserStore.js'
import {useFavoriteTeamStore} from '@/store/useFavoriteTeamStore.js'
import CancelBtn from '@/components/btn/CancelBtn.vue'
import SelectBtn from '@/components/btn/SelectBtn.vue'
import UserTeams from '@/page/mobile/user/Teams.vue'

const userStore = useUserStore()
const favoriteTeamStore = useFavoriteTeamStore()
const route = useRoute()
const router = useRouter()

const showProfileModal = ref(false)
const showNicknameModal = ref(false)
const showPasswordModal = ref(false)
const showTeamSelect = ref(false)
const fileInput = ref(null)

const newNickname = ref('')
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const openTeamSelect = () => (showTeamSelect.value = true)

const fetchUser = async () => {
  await userStore.getUser()
  newNickname.value = userStore.user?.nickname || ''
}

const triggerFileInput = () => fileInput.value?.click()
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) {
    return
  }
  await userStore.updateProfile(file)
  closeProfileModal()
}
const deleteProfile = async () => {
  await userStore.deleteProfile()
  closeProfileModal()
}

const openProfileModal = () => (showProfileModal.value = true)
const closeProfileModal = () => (showProfileModal.value = false)

const updateNickname = async () => {
  if (!newNickname.value.trim()) {
    return
  }
  await userStore.updateNickname(newNickname.value)
  closeNicknameModal()
  await fetchUser()
}
const closeNicknameModal = () => (showNicknameModal.value = false)

const updatePassword = async () => {
  await userStore.updatePassword({
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  })
  closePasswordModal()
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}
const closePasswordModal = () => (showPasswordModal.value = false)

const deleteUser = async () => await userStore.deleteUser()

const handleTeamSelect = async (team) => {
  const store = favoriteTeamStore
  if (store.favoriteTeam) {
    await store.updateFavoriteTeam(team.id)
  } else {
    await store.addFavoriteTeam(team.id)
  }
  await store.fetchFavoriteTeam()
  showTeamSelect.value = false
}
const deleteTeam = async () => {
  if (confirm('정말 응원팀을 삭제하시겠습니까?')) {
    await favoriteTeamStore.deleteFavoriteTeam()
  }
}
onMounted(async () => {
  await fetchUser()
  await favoriteTeamStore.fetchFavoriteTeam()
})
watch(() => route.fullPath, fetchUser)

const currentTeamLogo = computed(() => {
  const team = favoriteTeamStore.favoriteTeam
  if (!team || !team.teamCode) {
    // 기본 로고 경로
    return new URL('@/assets/images/team-logo-wordmark/default.png', import.meta.url).href
  }
  try {
    return new URL(`/src/assets/images/team-logo-wordmark/${team.teamCode}.png`, import.meta.url).href
  } catch {
    return new URL('/src/assets/images/team-logo-wordmark/default.png', import.meta.url).href
  }
})
</script>

<template>
  <div class="user-info-container">
    <div v-if="userStore.loading" class="loading">로딩중...</div>
    <div v-else-if="userStore.error" class="error">에러 발생!</div>
    <div v-else-if="userStore.user" class="user-card">
      <div class="profile-header">
        <div class="summary-left">
          <img
              :src="userStore.user.path"
              alt="프로필 이미지"
              class="profile-image"
              @click="openProfileModal"
          />
        </div>
        <div class="summary-right">
          <div class="favorite-team" @click="openTeamSelect">
            <img
                :src="currentTeamLogo"
                :alt="userStore.user?.teamName || '팀 선택'"
                class="favorite-team-img"
            >
          </div>
          <div class="summary-text">
            <h2 class="nickname">{{ userStore.user.nickname }}</h2>
            <p class="email">{{ userStore.user.email }}</p>
          </div>
          <div class="summary-action">
            <SelectBtn @click="showNicknameModal = true" label="닉네임 수정"/>
            <SelectBtn @click="showPasswordModal = true" label="비밀번호 변경"/>
          </div>
          <CancelBtn class="withdraw-button" @click="deleteUser" label="회원 탈퇴"/>
        </div>
      </div>

      <UserTeams
          v-if="showTeamSelect"
          @selectTeam="handleTeamSelect"
          @close="showTeamSelect = false"
      />
    </div>

    <div v-if="showProfileModal" class="modal-overlay" @click.self="closeProfileModal">
      <div class="modal">
        <img :src="userStore.user.path" alt="프로필 미리보기" class="modal-image"/>
        <input type="file" ref="fileInput" accept="image/*" @change="uploadImage" hidden/>
        <div class="modal-buttons">
          <button @click="triggerFileInput">이미지 변경</button>
          <button @click="deleteProfile">기본 이미지로 변경</button>
          <button @click="closeProfileModal">닫기</button>
        </div>
      </div>
    </div>

    <div v-if="showNicknameModal" class="modal-overlay" @click.self="closeNicknameModal">
      <div class="modal">
        <h3>닉네임 수정</h3>
        <input v-model="newNickname" class="nickname-input" placeholder="새 닉네임 입력"/>
        <div class="modal-buttons">
          <button @click="updateNickname">수정</button>
          <button @click="closeNicknameModal">취소</button>
        </div>
      </div>
    </div>

    <div v-if="showPasswordModal" class="modal-overlay" @click.self="closePasswordModal">
      <div class="modal">
        <h3>비밀번호 변경</h3>
        <input v-model="oldPassword" type="password" placeholder="현재 비밀번호" class="password-input"/>
        <input v-model="newPassword" type="password" placeholder="새 비밀번호" class="password-input"/>
        <input v-model="confirmPassword" type="password" placeholder="새 비밀번호 확인" class="password-input"/>
        <div class="modal-buttons">
          <button @click="updatePassword">변경</button>
          <button @click="closePasswordModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-info-container {
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
}

.loading,
.error {
  font-size: 1.5rem;
  color: #666;
  text-align: center;
  width: 100%;
  max-width: 500px;
}

.user-card {
  background-color: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.profile-image {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  margin: 0 auto 1.5rem auto;
  border: 3px solid #ccc;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.profile-image:hover {
  box-shadow: 0 0 8px #4a90e2;
}

.summary-left {
  display: flex;
  flex: 1;
}

.summary-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex: 1;
}

.favorite-team-img{
  width: 200px;
  height: 100px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.favorite-team-img:hover {
  transform: scale(1.05);
}

.summary-text {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.summary-action {
  display: flex;
  gap: 0.5rem;
}

.withdraw-button {
  width: 80%;
}

.nickname {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.nickname-input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin-right: 0.5rem;
  width: calc(100% - 100px);
}

.email {
  color: #666;
  font-size: 1rem;
}

.nickname-input,
.password-input {
  width: 100%;
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.select-btn-button {
  background-color: #4a90e2;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  font-size: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: inline-block;
  margin-bottom: 0.7rem;
}

.select-btn-button:hover {
  background-color: #0056b3;
}

.delete-team-btn {
  margin-left: 10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.password-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  box-sizing: border-box;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  width: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.modal-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  border: none;
  background: #4a90e2;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.modal-buttons button:hover {
  background: #357ab8;
}

@media (max-width: 480px) {
  .user-card {
    padding: 1.5rem 1rem;
    max-width: 100%;
  }

  .profile-image {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
  }

  .nickname-input {
    width: 100%;
  }

  .password-input {
    font-size: 0.9rem;
  }

  .select-btn-button {
    width: 100%;
    padding: 0.6rem 0;
    font-size: 1rem;
  }
}
</style>



