import axios from 'axios';

// Thay thế bằng API Key từ Goong
const GOONG_API_KEY = 'dNW8wC9fwI0JrrDrXTsrdrjWyelArYawfwp519Sy';
const GOONG_API_URL = 'https://rsapi.goong.io/Place/AutoComplete';

export const locationSuggestions = async (input) => {
  try {
    const response = await axios.get(GOONG_API_URL, {
      params: {
        api_key: GOONG_API_KEY,
        input, // Từ khóa người dùng nhập
        location: '21.028511,105.804817', // Mặc định là Hà Nội (có thể tùy chỉnh)
        radius: 50000, // Bán kính tìm kiếm (50km)
      },
    });
    return response.data.predictions; // Trả về danh sách gợi ý
  } catch (error) {
    console.error('Error fetching location suggestions:', error);
    return [];
  }
};
