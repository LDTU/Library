import { faPen, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import axios from "axios";
import SearchBarAdmin from "./SearchBarAdmin";
import Modal from "../../components/Modal/Modal";
import AddForm from "../../components/Form/AddForm";

function ManageBooks() {
    const [books, setBooks] = useState([]);
    const [visibleForm, setVisibleForm] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [bookData, setBookData] = useState({
        id: null,
        title: "",
        description: "",
        published_year: "",
        thumbnail: "",
        instock: "",
        availableStock: "",
        categoryIds: [],
        authorIds: [],
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/books/inventory-info");
                setBooks(response.data);
            } catch (error) {
                console.error("Error fetching books:", error);
                alert("Không thể tải danh sách sách. Vui lòng thử lại sau.");
            }
        };

        fetchBooks();
    }, []);

    const saveBook = async (bookData) => {
        // Kiểm tra thông tin bắt buộc
        if (
            !bookData.title ||
            !bookData.description ||
            !bookData.published_year ||
            !bookData.thumbnail ||
            !bookData.instock
        ) {
            alert("Vui lòng nhập đầy đủ thông tin sách!");
            return;
        }
    
        try {
            const payload = {
                bookId: bookData.id || null, // null nếu thêm mới
                title: bookData.title,
                description: bookData.description,
                publishedYear: parseInt(bookData.published_year, 10),
                linkFile: bookData.thumbnail,
                totalStock: parseInt(bookData.instock, 10),
                availableStock: parseInt(bookData.instock, 10), // availableStock = totalStock khi thêm mới
                categoryNames: bookData.categoryNames || [], // Danh mục là danh sách tên
                authorNames: bookData.authorNames || [], // Tác giả là danh sách tên
            };
    
            const response = await axios.post("http://localhost:8080/api/inventories/create", payload);
    
            if (bookData.id) {
                // Nếu chỉnh sửa, cập nhật danh sách sách
                setBooks((prevBooks) =>
                    prevBooks.map((book) =>
                        book.id === bookData.id ? response.data.book : book
                    )
                );
            } else {
                // Nếu thêm mới, thêm sách vào danh sách
                setBooks((prevBooks) => [...prevBooks, response.data.book]);
            }
    
            setVisibleForm(false); // Đóng form sau khi lưu
            alert("Lưu sách thành công!");
        } catch (error) {
            console.error("Error saving book:", error.response?.data || error.message);
            alert("Không thể lưu sách. Vui lòng thử lại.");
        }
    };
    
    
    
    

    const deleteBook = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sách này?")) return;
        try {
            await axios.delete(`http://localhost:8080/api/books/${id}`);
            setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
            alert("Xóa sách thành công!");
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Không thể xóa sách. Vui lòng thử lại.");
        }
    };

    const editBook = async (bookId) => {
        try {
            // Gọi API để lấy chi tiết sách
            const response = await axios.get(`http://localhost:8080/api/books/inventory-info`);
            const bookDetail = response.data.find((book) => book.id === bookId);
    
            if (!bookDetail) {
                alert("Không tìm thấy sách với ID này.");
                return;
            }
    
            // Kiểm tra và gán giá trị mặc định nếu tồn kho bị thiếu
            const totalStock = bookDetail.totalStock || 0;
            const availableStock = bookDetail.availableStock || 0;
    
            setBookData({
                id: bookDetail.id,
                title: bookDetail.title,
                description: bookDetail.description,
                published_year: bookDetail.publishedYear || "",
                thumbnail: bookDetail.linkFile || "",
                instock: totalStock,
                availableStock: availableStock,
                categoryIds: [], // Vì API này không cung cấp danh mục, để trống hoặc gọi thêm API khác nếu cần
                authorIds: [], // Tương tự với tác giả
            });
    
            setIsEdit(true);
            setVisibleForm(true);
        } catch (error) {
            console.error("Error fetching book details:", error);
            alert("Không thể tải thông tin sách. Vui lòng thử lại.");
        }
    };
    
    
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <Modal onClose={() => setVisibleForm(false)} isOpen={visibleForm}>
                <AddForm
                    bookData={bookData}
                    setBookData={setBookData}
                    setVisibleForm={setVisibleForm}
                    save={saveBook} // Truyền hàm saveBook
                />
            </Modal>

            <div className="borrow-history">
                <div className="Borrow-history-header">
                    <h1>Kho sách</h1>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <SearchBarAdmin
                            placeholder="Tìm kiếm theo tên sách..."
                            onSearch={(value) => setSearchQuery(value)}
                        />
                        <button
                            className="CreateButton"
                            onClick={() => {
                                setVisibleForm(true);
                                setIsEdit(false); // Đặt chế độ là thêm mới
                                setBookData({
                                    id: null,
                                    title: "",
                                    description: "",
                                    published_year: "",
                                    thumbnail: "",
                                    instock: "",
                                    availableStock: "",
                                    categoryIds: [],
                                    authorIds: [],
                                }); // Reset dữ liệu về trạng thái mặc định
                            }}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </button>
                    </div>
                </div>
                <div className="borrow-list">
                    {filteredBooks.length === 0 ? (
                        <p className="empty-history">Không tìm thấy sách nào.</p>
                    ) : (
                        filteredBooks.map((book) => (
                            <div key={book.id} className="borrow-item">
                                <img
                                    src={book.linkFile}
                                    alt={`Bìa sách: ${book.title}`}
                                    className="book-cover"
                                />
                                <div className="borrow-details">
                                    <h3 className="book-title">{book.title}</h3>
                                    <p>Trong kho: {book.totalStock || "N/A"}</p>
                                    <p>Đang được mượn: {book.borrowingCount || 0}</p>
                                </div>
                                <button
                                    className="UpdateButton"
                                    onClick={() => editBook(book.id)} // Sử dụng book.id để truyền đúng ID của sách
                                >
                                    <FontAwesomeIcon icon={faPen} />
                                </button>
                                <button
                                    className="DeleteButton"
                                    onClick={() => deleteBook(book.id)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}

export default ManageBooks;
