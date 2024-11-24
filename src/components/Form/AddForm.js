import React, { useState } from "react";
import "./Form.css";
import axios from "axios";

function AddForm({ bookData, setBookData, setVisibleForm, save }) {
    const [newCategory, setNewCategory] = useState("");
    const [newAuthor, setNewAuthor] = useState("");

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
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
            // Tách danh mục và tác giả từ input
            const categories = newCategory.split(",").map((cat) => cat.trim());
            const authors = newAuthor.split(",").map((auth) => auth.trim());
    
            // Tạo dữ liệu mới cho POST
            const updatedBookData = {
                ...bookData,
                publishedYear: bookData.published_year,
                totalStock: parseInt(bookData.instock, 10),
                availableStock: parseInt(bookData.instock, 10), // availableStock = totalStock
                categoryNames: categories,
                authorNames: authors,
            };
    
            // Gọi hàm `save` truyền từ props
            await save(updatedBookData);
    
            // Reset form
            setBookData({
                id: null,
                title: "",
                description: "",
                published_year: "",
                thumbnail: "",
                instock: "",
                availableStock: "",
                categoryNames: [],
                authorNames: [],
            });
            setNewCategory("");
            setNewAuthor("");
            setVisibleForm(false);
        } catch (error) {
            console.error("Error adding book:", error);
            alert("Không thể thêm sách. Vui lòng kiểm tra dữ liệu và thử lại.");
        }
    };
    

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="admin-form-container">
                    <h3>{bookData.id ? "Chỉnh sửa sách" : "Thêm sách mới"}</h3>
                    <label>
                        Tiêu đề:
                        <input
                            required
                            type="text"
                            name="title"
                            value={bookData.title}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Mô tả:
                        <textarea
                            required
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <label>
                        Năm xuất bản:
                        <input
                            required
                            type="number"
                            name="published_year"
                            value={bookData.published_year}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Tổng số lượng:
                        <input
                            required
                            type="number"
                            name="instock"
                            value={bookData.instock}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Link file:
                        <input
                            required
                            type="text"
                            name="thumbnail"
                            value={bookData.thumbnail}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Danh mục (cách nhau bằng dấu phẩy):
                        <input
                            type="text"
                            placeholder="Nhập danh mục, ví dụ: Khoa học, Lịch sử"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </label>
                    <label>
                        Tác giả (cách nhau bằng dấu phẩy):
                        <input
                            type="text"
                            placeholder="Nhập tác giả, ví dụ: Nguyễn Văn A, Trần Thị B"
                            value={newAuthor}
                            onChange={(e) => setNewAuthor(e.target.value)}
                        />
                    </label>
                    <button className="admin-button-form" type="submit">
                        {bookData.id ? "Cập nhật" : "Thêm mới"}
                    </button>
                </div>
            </form>

        </>
    );
}

export default AddForm;
