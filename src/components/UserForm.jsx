import { useState, useEffect } from 'react';
import './UserForm.css';

// Component form để thêm mới hoặc chỉnh sửa người dùng
const UserForm = ({ user = null, onSave, onCancel }) => {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // State lưu trữ các lỗi validation
  const [errors, setErrors] = useState({});

  // Cập nhật form khi có user được truyền vào (chế độ chỉnh sửa)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  // Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Hàm validate dữ liệu form
  const validate = () => {
    const newErrors = {};
    
    // Kiểm tra tên không được để trống
    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống';
    }
    
    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    // Kiểm tra số điện thoại không được để trống
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Hàm xử lý khi submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Kiểm tra validation trước khi submit
    if (validate()) {
      const userData = {
        ...formData,
        ...(user && { id: user.id })
      };
      onSave(userData);
      
      // Reset form nếu đang thêm người dùng mới
      if (!user) {
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
      }
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={errors.name ? 'error' : ''}
        />
        {errors.name && <span className="error-message">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone:</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <span className="error-message">{errors.phone}</span>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-save">
          {user ? 'Update' : 'Add'} User
        </button>
        {onCancel && (
          <button type="button" className="btn btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;
