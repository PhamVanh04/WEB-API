import './SearchBar.css';

// Component thanh tìm kiếm người dùng
const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Tìm kiếm người dùng theo tên..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
