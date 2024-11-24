import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import SearchBar from "../SearchBar/SearchBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import DropDownMenu from "../DropDownItems/DropDownItems";
import axios from "axios";

function NavBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/books");
        setBooks(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu sách:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navBarLogo">
          Logo
        </Link>
        <SearchBar items={books} />
        <button className="menuButton" onClick={() => setOpenMenu(!openMenu)}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </nav>
      {openMenu && <DropDownMenu />}
      <div style={{ height: "80px" }}></div>
    </>
  );
}

export default NavBar;
