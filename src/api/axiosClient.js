import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_PORT, // Thay đổi thành URL của API của bạn
    timeout: 10000, // Thời gian chờ tối đa
    headers: {
        'Content-Type': 'application/json',
        // Các header khác nếu cần
    },
});

export default axiosClient;