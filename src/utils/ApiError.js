export const ApiError = (error) => {
    if (!error.response) {
        console.error('네트워크 오류 또는 서버 응답 없음', error);
        return { message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' };
    }
    let serverMessage = error.response.data?.error?.message || error.response.data?.message;
    const status = error.response.status;

    switch (status) {
        case 400:
            if (!serverMessage) serverMessage = '잘못된 요청입니다.';
            break;
        case 401:
            if (!serverMessage) serverMessage = '로그인이 필요합니다.';
            break;
        case 403:
            if (!serverMessage) serverMessage = '권한이 없습니다.';
            break;
        case 404:
            if (!serverMessage) serverMessage = '요청한 자원을 찾을 수 없습니다.';
            break;
        case 500:
            if (!serverMessage) serverMessage = '서버에 오류가 발생했습니다.';
            break;
    }

    console.error(`${status}: ${serverMessage}`);
    return { status, message: serverMessage };
}
