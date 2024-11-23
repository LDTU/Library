import React from "react";
import "./Form.css";

function AddForm({ bookData, setBookData, setVisibleForm, add }) {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookData({ ...bookData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await add();
            setBookData({
                title: "",
                authors: "",
                category: "",
                thumbnail: "",
                description: "",
                published_year: "",
                instock: "",
            });
            setVisibleForm(false);
        } catch (error) {
            console.error("Error adding book:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="admin-form-container">
                    <h3>Thêm sách</h3>
                    <label>
                        Title:
                        <input
                            required
                            type="text"
                            name="title"
                            value={bookData.title}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={bookData.description}
                            onChange={handleInputChange}
                        ></textarea>
                    </label>
                    <label>
                        Published Year:
                        <input
                            type="text"
                            name="published_year"
                            value={bookData.published_year}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Total Stock:
                        <input
                            type="number"
                            name="instock"
                            value={bookData.instock}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label>
                        Thumbnail:
                        <input
                            type="text"
                            name="thumbnail"
                            value={bookData.thumbnail}
                            onChange={handleInputChange}
                        />
                    </label>
                </div>
                <button className="admin-button-form" type="submit">
                    Add
                </button>
            </form>
        </>
    );
}

export default AddForm;
