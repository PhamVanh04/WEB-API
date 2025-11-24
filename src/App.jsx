import { useState, useEffect } from 'react';
import axios from 'axios';
import UserTable from './components/UserTable';
import UserForm from './components/UserForm';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import './App.css';

// URL API để lấy danh sách người dùng
const API_URL = 'https://jsonplaceholder.typicode.com/users';
// Số lượng người dùng hiển thị trên mỗi trang
const USERS_PER_PAGE = 5;

function App() {
  // State lưu trữ danh sách tất cả người dùng
  const [users, setUsers] = useState([]);
  // State lưu trữ danh sách người dùng đã được lọc theo từ khóa tìm kiếm
  const [filteredUsers, setFilteredUsers] = useState([]);
  // State theo dõi trạng thái loading
  const [loading, setLoading] = useState(true);
  // State lưu trữ thông báo lỗi
  const [error, setError] = useState(null);
  // State lưu từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  // State lưu trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);

  // Gọi API lấy danh sách người dùng khi component được mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu tiên khi tìm kiếm
  }, [searchTerm, users]);

  // Hàm lấy danh sách người dùng từ API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      // Gọi API sử dụng axios với async/await
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      // Xử lý lỗi nếu không lấy được dữ liệu
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm người dùng mới
  const handleAddUser = async (userData) => {
    try {
      setError(null);
      // Gửi request POST để thêm người dùng mới
      const response = await axios.post(API_URL, userData);
      
      // Cập nhật UI thủ công (JSONPlaceholder không thực sự tạo user mới)
      const newUser = {
        ...response.data,
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
      };
      
      // Thêm user mới vào đầu danh sách
      setUsers(prev => [newUser, ...prev]);
      alert('Thêm người dùng thành công!');
    } catch (err) {
      // Xử lý lỗi khi thêm thất bại
      setError('Không thể thêm người dùng. Vui lòng thử lại.');
      console.error('Error adding user:', err);
    }
  };

  // Hàm cập nhật thông tin người dùng
  const handleUpdateUser = async (userData) => {
    try {
      setError(null);
      // Gửi request PUT để cập nhật thông tin người dùng
      await axios.put(`${API_URL}/${userData.id}`, userData);
      
      // Cập nhật UI thủ công sau khi API trả về thành công
      setUsers(prev => prev.map(user => 
        user.id === userData.id ? userData : user
      ));
      alert('Cập nhật người dùng thành công!');
    } catch (err) {
      // Xử lý lỗi khi cập nhật thất bại
      setError('Không thể cập nhật người dùng. Vui lòng thử lại.');
      console.error('Error updating user:', err);
    }
  };

  // Hàm xóa người dùng
  const handleDeleteUser = async (userId) => {
    // Xác nhận trước khi xóa
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      setError(null);
      // Gửi request DELETE để xóa người dùng
      await axios.delete(`${API_URL}/${userId}`);
      
      // Cập nhật UI thủ công - loại bỏ user đã xóa khỏi danh sách
      setUsers(prev => prev.filter(user => user.id !== userId));
      alert('Xóa người dùng thành công!');
    } catch (err) {
      // Xử lý lỗi khi xóa thất bại
      setError('Không thể xóa người dùng. Vui lòng thử lại.');
      console.error('Error deleting user:', err);
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Logic phân trang
  const indexOfLastUser = currentPage * USERS_PER_PAGE; // Chỉ số của user cuối cùng trên trang hiện tại
  const indexOfFirstUser = indexOfLastUser - USERS_PER_PAGE; // Chỉ số của user đầu tiên trên trang hiện tại
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Danh sách user hiển thị trên trang hiện tại
  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE); // Tổng số trang

  // Hiển thị loading khi đang tải dữ liệu
  if (loading) {
    return <div className="loading">Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="app">
      <h1>User Management System</h1>
      
      {error && <div className="error-banner">{error}</div>}
      
      <div className="add-user-section">
        <h2>Add New User</h2>
        <UserForm onSave={handleAddUser} />
      </div>

      <div className="users-section">
        <h2>Users List ({filteredUsers.length})</h2>
        
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        
        {currentUsers.length > 0 ? (
          <>
            <UserTable
              users={currentUsers}
              onUpdate={handleUpdateUser}
              onDelete={handleDeleteUser}
            />
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        ) : (
          <p className="no-users">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
