import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./BookList.css";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [showDictionary, setShowDictionary] = useState(false);
  const [dictionary, setDictionary] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/books");
        setBooks(response.data);
      } catch (error) {
        console.error("can't fetch books in booklist file", error);
      }
    };
    fetchBooks();
  }, []);

  const handleShowHighlights = async (bookId) => {
    try {
      const response = await api.get(`/books/${bookId}/highlights`);
      setHighlights(response.data);
      setSelectedBook(bookId);
    } catch (error) {
      console.error("can't fetch highlights in booklist", error);
    }
  };

  const handleShowDictionary = async () => {
    try {
      const response = await api.get("/dictionary");
      setDictionary(response.data);
      setShowDictionary(true);
    } catch (error) {
      console.error("error fetching dictionary", error);
    }
  };

  return (
    <div className="book-list-container">
      <h2>My Books</h2>
      <button className="dictionary-button" onClick={handleShowDictionary}>
        My Dictionary
      </button>
      <div className="book-grid">
        {books.map((book) => (
          <div key={book._id} className="book-item">
            <Link to={`/books/${book._id}`} className="book-title">
              {book.title}
            </Link>
            <button
              className="highlight-button"
              onClick={() => handleShowHighlights(book._id)}
            >
              Show Highlights
            </button>
          </div>
        ))}
      </div>
      {selectedBook && (
        <div className="modal">
          <div className="modal-content">
            <h3>
              Highlights for {books.find((b) => b._id === selectedBook)?.title}
            </h3>
            <ul>
              {highlights.map((highlight, index) => (
                <li key={index}>
                  {/* <p>Chapter: {highlight.chapter}</p> */}
                  <p>Text: {highlight.text}</p>
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedBook(null)}>Close</button>
          </div>
        </div>
      )}
      {showDictionary && (
        <div className="modal">
          <div className="modal-content">
            <h3>My Dictionary</h3>
            <ul>
              {dictionary.map((entry, index) => (
                <li key={index}>
                  <strong>{entry.word}:</strong> {entry.meaning}
                </li>
              ))}
            </ul>
            <button onClick={() => setShowDictionary(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookList;
