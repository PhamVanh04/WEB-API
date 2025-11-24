import { useState } from 'react';
import UserForm from './UserForm';
import './UserTable.css';

// Component hiển thị bảng danh sách người dùng
const UserTable = ({ users, onUpdate, onDelete }) => {
  // State lưu thông tin người dùng đang được chỉnh sửa
  const [editingUser, setEditingUser] = useState(null);

  // Hàm mở form chỉnh sửa người dùng
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  // Hàm đóng form chỉnh sửa
  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  // Hàm lưu thông tin người dùng sau khi chỉnh sửa
  const handleSaveEdit = (updatedUser) => {
    onUpdate(updatedUser);
    setEditingUser(null);
  };

  return (
    <div className="user-table-container">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button 
                  className="btn btn-edit"
                  onClick={() => handleEdit(user)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => onDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hiển thị modal chỉnh sửa khi có người dùng đang được chỉnh sửa */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Chỉnh Sửa Người Dùng</h2>
            <UserForm
              user={editingUser}
              onSave={handleSaveEdit}
              onCancel={handleCloseEdit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
