import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Màu nền nhẹ nhàng hơn
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff', // Màu nền trắng tinh khiết
    elevation: 3, // Bóng đổ nhẹ để tạo chiều sâu cho header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333', // Màu chữ đậm để tương phản tốt
  },
  searchIcon: {
    //marginRight: 10,
    right:-90,
    color: '#333', // Màu biểu tượng đồng nhất với màu chữ
  },
  groupChatIcon: {
    marginRight: 10,
    color: '#333',
  },
  horizontalMenu: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Đường kẻ nhẹ bên dưới để phân tách
  },
  menuButtonHorizontal: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10, // Bo góc nhẹ nhàng cho nút
  },
  menuTextHorizontal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555', // Màu chữ nhạt hơn khi chưa được chọn
  },
  activeTab: {
    backgroundColor: '#2196F3', // Màu xanh nổi bật khi tab được chọn
  },
  chatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2, // Hiệu ứng bóng đổ cho mỗi mục chat
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Hình ảnh người dùng bo tròn hoàn toàn
    borderWidth: 2,
    borderColor: '#ddd', // Đường viền nhạt quanh ảnh đại diện
  },
  chatDetails: {
    flex: 1,
    marginLeft: 15, // Khoảng cách giữa ảnh và chi tiết cuộc trò chuyện
  },
  chatUser: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333', // Màu chữ đậm
  },
  lastMessage: {
    color: '#888', // Màu chữ nhạt hơn cho tin nhắn cuối
    marginTop: 5,
  },
  menuButton: {
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 22,
    color: '#888', // Màu biểu tượng ba chấm (menu)
  },
  menu: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // Tạo cảm giác nổi cho menu
  },
  menuItem: {
    paddingVertical: 12,
    color: '#f44336', // Màu đỏ để cảnh báo cho tùy chọn xóa
    fontWeight: '500',
  },
  groupMenu: {
    position: 'absolute',
    top: 60, // Vị trí menu dưới thanh header
    right: 16,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
