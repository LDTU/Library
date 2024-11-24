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

        try {
            // Prepare category and author arrays
            const categories = newCategory.split(",").map((cat) => cat.trim());
            const authors = newAuthor.split(",").map((auth) => auth.trim());

            // Prepare data for POST request
            const updatedBookData = {
                title: bookData.title,
                description: bookData.description,
                publishedYear: bookData.published_year,
                linkFile: bookData.thumbnail,
                totalStock: bookData.instock,
                availableStock: bookData.instock, // Assuming all stock is initially available
                categoryNames: categories,
                authorNames: authors,
            };

            // POST request to save inventory
            await axios.post("http://localhost:8080/api/inventories/create", updatedBookData);

            // Reset form
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
            <form  onSubmit={(e) => {

                                    save(bookData); 
                                            }}>
                <div className="admin-form-container">
                    <h3>Thêm sách</h3>
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
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <label>
                        Năm xuất bản:
                        <input
                            type="text"
                            name="published_year"
                            value={bookData.published_year}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Tổng số lượng:
                        <input
                            type="number"
                            name="instock"
                            value={bookData.instock}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Link file (thumbnail):
                        <input
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
                </div>
                <button className="admin-button-form" type="submit">
                    Thêm
                </button>
            </form>
        </>
    );
}

export default AddForm;
