<template>
  <div class="date-picker">
    <div v-for="(date, index) in dateList"
         :key="index"
         :class="'date-wrapper'"
         @click="selectDate(date, index)">

      <div class="date">

        <div :class="['date-top', date.isSelected ? 'date-selected' : 'text-wrapper']">
          {{ date.day }}
        </div>

        <div :class="['date-bottom', date.isSelected ? 'date-selected' : 'text-wrapper']">
          {{ date.monthDay }}
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "DatePicker",
  data() {
    return {
      selectedIndex: 0
    }
  },
  computed: {
    dateList() {
      const dates = [];
      const today = new Date();
      const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

      // 오늘부터 5일 후 까지 6개의 날짜 생성
      for (let i = 0; i < 6; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // 달은 +1 해줘야함;
        const weekday = weekdays[currentDate.getDay()];
        const isSelected = (i === this.selectedIndex);

        dates.push({
          day,
          isSelected,
          fullDate: currentDate,
          monthDay: `${month}/${day} (${weekday})`
        })
      }

      return dates;
    }
  },
  methods: {
    selectDate(selectedDate, index) {
      // 선택된 인덱스 업데이트
      this.selectedIndex = index;

      // 부모 컴포넌트에 선택된 날짜 전달
      this.$emit('date-selected', selectedDate.fullDate);

      console.log(`DatePicker selected date: ${selectedDate.fullDate}`)
    }
  }
}
</script>

<style>
.date-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;

  background-color: #faf6e9;
  height: 63px;
  padding: 10px;
  position: relative;
  width: 100%;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.date-picker .date-wrapper {
  height: 47px;
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 마지막 요소가 아닌 경우에만 우측에 구분선 표시 */
.date-picker .date-wrapper:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 1px;
  height: 44px;
  background-color: black;
}


.date-picker .date {
  height: 47px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
}

.date-top {
  color: #979797;
  font-family: "NanumSquare_ac-ExtraBold", Helvetica;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0;
  line-height: normal;
  text-align: center;
}

.date-bottom {
  color: #979797;
  font-family: "KBO Dia Gothic-Medium", Helvetica;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  text-align: center;
  white-space: nowrap;
}

.date-selected {
  color: #212121;
}

</style>