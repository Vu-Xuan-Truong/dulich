import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  notificationContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  commentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 12,
  },
  commenterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  commentContent: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 15,
    color: '#222',
  },
  newcomment: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  mediaWrapper: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  postMedia: {
    width: '100%',
    height: '100%',
  },
  followerContainer: {
    flexDirection: 'row', // Căn theo hàng ngang
    alignItems: 'center', // Căn giữa dọc
    justifyContent: 'space-between', // Phân bố đều giữa các phần tử
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // Ảnh đại diện
  followerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  // Tên người dùng
  followerName: {
    flex: 1, // Chiếm khoảng trống còn lại giữa ảnh và nút
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },

  // Nút Follow
  followButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#3498db',
    borderRadius: 5,
  },

  // Nút Unfollow
  unfollowButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
  },

  // Văn bản trong nút
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    marginHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    padding: 10,
    flexGrow: 1, // Đảm bảo nội dung có thể cuộn
  },
});
