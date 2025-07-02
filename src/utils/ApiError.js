export const ApiError = (error) => {
    if (!error.response) {
        console.error('네트워크 오류 또는 서버 응답 없음', error);
        return { message: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' };
    }

    const status = error.response.status;
    const data = error.response.data || {};

    let serverMessage = '';

    if (data.error?.fieldErrors && data.error.fieldErrors.length > 0) {
        // 첫 번째 에러 메시지만 필드명 없이 가져오기
        const firstError = data.error.fieldErrors[0];
        serverMessage = firstError.reason;
    } else if (data.error?.message) {
        serverMessage = data.error.message;
    } else if (data.message) {
        serverMessage = data.message;
    }

    if (!serverMessage) {
        switch (status) {
            case 400:
                serverMessage = '잘못된 요청입니다.';
                break;
            case 401:
                serverMessage = '로그인이 필요합니다.';
                break;
            case 403:
                serverMessage = '권한이 없습니다.';
                break;
            case 404:
                serverMessage = '요청한 자원을 찾을 수 없습니다.';
                break;
            case 500:
                serverMessage = '서버에 오류가 발생했습니다.';
                break;
            default:
                serverMessage = '알 수 없는 오류가 발생했습니다.';
        }
    }

    console.error(`${status}: ${serverMessage}`);
    return { status, message: serverMessage };
}
