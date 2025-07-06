<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/useUserStore.js'
import CancelBtn from '@/components/btn/CancelBtn.vue'
import SubBtn from '@/components/btn/SubBtn.vue'
import SelectBtn from "@/components/btn/SelectBtn.vue";
import UserTeams from "@/page/mobile/user/Teams.vue";
import {useFavoriteTeamStore} from "@/store/useFavoriteTeamStore.js";
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const route = useRoute()
const editing = ref(false)
const newNickname = ref('')
const showPasswordForm = ref(false)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showTeamSelect = ref(false)
const favoriteTeamStore = useFavoriteTeamStore()
const router = useRouter()


const openTeamSelect = () => {
  showTeamSelect.value = true
}
const fetchUser = async () => {
  await userStore.getUser()
  newNickname.value = userStore.user?.nickname || ''
}

const updateNickname = async () => {
  if (!newNickname.value.trim()) return
  await userStore.updateNickname(newNickname.value)
  editing.value = false
  await fetchUser()
}

const updatePassword = async () => {
  await userStore.updatePassword({
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  })

  showPasswordForm.value = false
  oldPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const deleteUser = async () => {
  await userStore.deleteUser()
}

const showModal = ref(false)
const fileInput = ref(null)

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const triggerFileInput = () => {
  fileInput.value?.click()
}
const uploadImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  await userStore.updateProfile(file)
  closeModal()
}

const deleteProfile = async () => {
  await userStore.deleteProfile()
  closeModal()
}
const handleTeamSelect = async (team) => {
  if (favoriteTeamStore.favoriteTeam) {
    await favoriteTeamStore.updateFavoriteTeam(team.id)
  } else {
    await favoriteTeamStore.addFavoriteTeam(team.id)
  }
  await favoriteTeamStore.fetchFavoriteTeam()

  showTeamSelect.value = false


  await router.push({name: 'my-page'})

}

const deleteTeam = async () => {
  if(confirm("정말 응원팀을 삭제하시겠습니까?")) {
    await favoriteTeamStore.deleteFavoriteTeam()
  }
}


onMounted(async () => {
  await fetchUser()
  await favoriteTeamStore.fetchFavoriteTeam()
})
watch(() => route.fullPath, fetchUser)
</script>

<template>
  <div class="user-info-container">
    <div v-if="userStore.loading" class="loading">로딩중...</div>
    <div v-else-if="userStore.error" class="error">에러 발생!</div>
    <div v-else-if="userStore.user" class="user-card">
      <img
          :src="userStore.user.path"
          alt="프로필 이미지"
          class="profile-image"
          @click="openModal"
      />

      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <img
              :src="userStore.user.path"
              alt="프로필 미리보기"
              class="modal-image"
          />
          <input
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="uploadImage"
              hidden
          />
          <div class="modal-buttons">
            <button @click="triggerFileInput">이미지 변경</button>
            <button @click="deleteProfile">기본 이미지로 변경</button>
            <button @click="closeModal">닫기</button>
          </div>
        </div>
      </div>

      <section class="info-section nickname-section">
        <template v-if="editing">
          <input v-model="newNickname" class="nickname-input" />
          <SubBtn @click="updateNickname" />
          <CancelBtn @click="editing = false" />
        </template>
        <template v-else>
          <p class="nickname">
            <strong>닉네임:</strong> {{ userStore.user.nickname }}
          </p>
          <SelectBtn @click="editing = true" label="닉네임 수정" />
        </template>
      </section>

      <section class="info-section email-section">
        <p class="email">
          <strong>이메일:</strong> {{ userStore.user.email }}
        </p>
      </section>

      <section class="info-section password-section">
        <SelectBtn
            @click="showPasswordForm = !showPasswordForm"
            label="비밀번호 변경"
        />

        <div v-if="showPasswordForm" class="password-form">
          <input
              v-model="oldPassword"
              type="password"
              placeholder="현재 비밀번호"
              class="password-input"
          />
          <input
              v-model="newPassword"
              type="password"
              placeholder="새 비밀번호"
              class="password-input"
          />
          <input
              v-model="confirmPassword"
              type="password"
              placeholder="새 비밀번호 확인"
              class="password-input"
          />

          <div class="password-buttons">
            <SubBtn @click="updatePassword" />
            <CancelBtn @click="showPasswordForm = false" />
          </div>
        </div>
      </section>

      <section class="info-section team-select-section">
        <button class="select-btn-button" @click="openTeamSelect">
          팀 선택하기
        </button>

        <div v-if="favoriteTeamStore.favoriteTeam" class="selected-team">
          응원하는 팀:
          <strong>{{ favoriteTeamStore.favoriteTeam.teamName }}</strong>
          <button @click="deleteTeam" class="delete-team-btn">팀 삭제</button>
        </div>
        <div v-else>
          응원팀이 등록되어 있지 않습니다.
        </div>


        <UserTeams
            v-if="showTeamSelect"
            @selectTeam="handleTeamSelect"
            @close="showTeamSelect = false"
        />
      </section>

      <section class="info-section delete-section">
        <CancelBtn @click="deleteUser" label="회원 탈퇴" />
      </section>
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
  padding: 2rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 1.5rem;
  background-color: #f5f5f5;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.profile-image {
  width: 160px;
  height: 160px;
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

.info-section {
  width: 100%;
  text-align: left;
}

.nickname-section,
.email-section,
.password-section,
.team-select-section,
.delete-section {
  margin-bottom: 1rem;
}

.nickname {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #222;
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
  font-size: 1.2rem;
  color: #444;
}

.password-section {
  position: relative;
}

.password-form {
  margin-top: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.password-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.4rem;
  box-sizing: border-box;
}

.password-buttons {
  display: flex;
  justify-content: flex-start;
  gap: 0.5rem;
  margin-top: 0.6rem;
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
  background-color: #357ab8;
}

.selected-team {
  font-size: 1.1rem;
  color: #222;
  margin-top: 0.3rem;
  user-select: none;
}

.delete-section {
  margin-top: 1rem;
  text-align: center;
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

.delete-team-btn {
  margin-left :10px;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.delete-team-btn:hover {
  background-color: #c0392b;
}

</style>



