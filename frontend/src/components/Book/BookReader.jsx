import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./BookReader.css";

const BookReader = () => {
  const [book, setBook] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [dictionaryResult, setDictionaryResult] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const { id } = useParams();
  const bookContentRef = useRef(null);

  useEffect(() => {
    const fetchBookAndHighlights = async () => {
      try {
        const [bookResponse, highlightsResponse] = await Promise.all([
          api.get(`/books/${id}`),
          api.get(`/books/${id}/highlights`),
        ]);

        const bookData = bookResponse.data;

        // Extract only the body content
        const parser = new DOMParser();
        const doc = parser.parseFromString(bookData.htmlContent, "text/html");
        const bodyContent = doc.body.innerHTML;

        setBook({
          ...bookData,
          htmlContent: bodyContent,
        });

        setHighlights(highlightsResponse.data);
      } catch (error) {
        console.error("Error fetching book or highlights", error);
      }
    };

    fetchBookAndHighlights();
  }, [id]);

  const applyHighlights = useCallback(() => {
    if (bookContentRef.current && highlights.length > 0) {
      let content = bookContentRef.current.innerHTML;
      highlights.forEach((highlight) => {
        if (highlight && highlight.text) {
          const escapedText = highlight.text.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
          );
          const regex = new RegExp(`(${escapedText})`, "g");
          content = content.replace(regex, '<span class="highlight">$1</span>');
        }
      });
      bookContentRef.current.innerHTML = content;
    }
  }, [highlights]);

  useEffect(() => {
    if (book) {
      applyHighlights();
    }
  }, [book, applyHighlights]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    setSelectedText(text);

    if (text.length > 0 && text.split(" ").length === 1) {
      fetchDictionaryMeaning(text);
    } else {
      setDictionaryResult(null);
    }
  };

  const fetchDictionaryMeaning = async (word) => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const meaning =
        data[0]?.meanings[0]?.definitions[0]?.definition ||
        "No definition found";
      setDictionaryResult(meaning);
    } catch (error) {
      console.error("Error fetching dictionary data", error);
      setDictionaryResult("Unable to fetch definition");
    }
  };

  const addToDictionary = async () => {
    try {
      await api.post("/dictionary", {
        word: selectedText,
        meaning: dictionaryResult,
      });
      alert("Word added to dictionary!");
    } catch (error) {
      console.error("Error adding word to dictionary", error);
      alert("Failed to add word to dictionary");
    }
  };
  const addToHighlights = async () => {
    try {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const startContainer = range.startContainer;
      const paragraphElement = startContainer.parentElement.closest("p");
      if (!paragraphElement) {
        console.warn("Unable to find paragraph element for highlight");
        return;
      }
      const paragraphIndex = Array.from(
        paragraphElement.parentElement.children
      ).indexOf(paragraphElement);

      const response = await api.post("/books/highlights", {
        bookId: id,
        chapter: "Chapter 1", // You might need to implement chapter detection
        paragraphIndex,
        startOffset: range.startOffset,
        endOffset: range.endOffset,
        text: selectedText,
      });

      if (response.data && response.data.highlight) {
        setHighlights((prevHighlights) => [
          ...prevHighlights,
          response.data.highlight,
        ]);
        applyHighlights(); // Apply highlights immediately after adding
        alert("Highlight added!");
      } else {
        console.warn(
          "Invalid highlight data received from server:",
          response.data
        );
      }
    } catch (error) {
      console.error("Error saving highlight", error);
      alert("Failed to add highlight");
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div className="book-reader">
      <h1>{book.title}</h1>
      <div
        ref={bookContentRef}
        className="book-content"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: book.htmlContent }}
      />
      {selectedText && (
        <div className="selection-actions">
          {selectedText.split(" ").length === 1 ? (
            <button onClick={addToDictionary}>Add to Dictionary</button>
          ) : (
            <button onClick={addToHighlights}>Add to Highlights</button>
          )}
        </div>
      )}
      {dictionaryResult && (
        <div className="dictionary-popup">
          <h3>{selectedText}</h3>
          <p>{dictionaryResult}</p>
        </div>
      )}
    </div>
  );
};

export default BookReader;
