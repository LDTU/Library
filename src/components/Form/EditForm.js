import { useState } from "react";
import "./Form.css";
import axios from "axios";


function EditForm({ formType, setVisibleForm, bookData, setBookData }) {
    const [updateBookData, setUpdateBookData] = useState({
        title: "",
        authors: "",
        category: "",
        thumbnail: "",
        description: "",
        published_year: "",
        instock: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateBookData((prevBookData) => ({
            ...prevBookData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8080/api/books/${bookData.id}`, bookData);
            setBookData((prevBooks) =>
                prevBooks.map((item) => (item.id === bookData.id ? response.data : item))
            );
            alert("Cập nhật sách thành công!");
            setVisibleForm(false);
        } catch (error) {
            console.error("Error updating book:", error);
            alert("Không thể cập nhật sách. Vui lòng thử lại.");
        }
    };
    return (
        <>
            <form onSubmit={handleSubmit}>
                {formType === "book" && (
                    <div className="admin-form-container">
                        <h3>Sửa sách</h3>
                        <label>
                            Title:
                            <input
                                required
                                type="text"
                                name="title"
                                value={updateBookData.title}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Authors:
                            <input
                                type="text"
                                name="authors"
                                value={updateBookData.authors}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Categories:
                            <input
                                type="text"
                                name="category"
                                value={updateBookData.category}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Published year:
                            <input
                                type="text"
                                name="published_year"
                                value={updateBookData.published_year}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Stocks:
                            <input
                                type="text"
                                name="instock"
                                value={updateBookData.instock}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Thumbnail:
                            <input
                                type="text"
                                name="thumbnail"
                                value={updateBookData.thumbnail}
                                onChange={handleInputChange}
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                name="description"
                                value={updateBookData.description}
                                onChange={handleInputChange}
                            ></textarea>
                        </label>
                    </div>
                )}
                <button type="submit" className="admin-button-form">
                    Update
                </button>
            </form>
        </>
    );
}

export default EditForm;
