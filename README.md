프로젝트 public
정적 파일 -> 관리 필요없는 favicon같은 고정 로고 이미지나
변경점이 적은 이미지

프로젝트 소스 구조 

assets : CSS 담는 곳

components : 공용으로 사용될 수 있는 요소들 담는 곳

레이아웃 : 헤더 푸터만 담았음 (left right 등 요소 담을 수 있음)

page : 주요 페이지들

router : 페이지의 경로, 이름, 사용 파일 등록하는 곳 router.push('name')과 같이 사용 가능

store : 통신 파일만 담는 곳 (if a == null return 같은거는 vue 파일에 script에 담으면 됨)

App.vue 처음 실행되는 파일
파일 내부에 <router-view />가 있음 얘를 라우터.js있는 파일을 보면서 경로 인식함

main.js 설정 파일 

axios.js 통신 커스텀 파일 프론트의 fatch 통신이라 생각하면 됨 임포트할 때 저 파일 임포트해야
localhost8080/api 이렇게 안쓰고 간단하게 쓸 수 있음

그 밑 제이슨 들은 딸려오는 설정 파일 커스텀 가능함 (포트 변경 등)

-----
메모장: URL: http://localhost:5173/liveboard/match/room/394

일단 시큐리티 문제였음