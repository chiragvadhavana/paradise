import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Book from "./pages/Book";
import AuthProvider from "./context/AuthContext";
import BookList from "./components/Book/BookList";
import BookReader from "./components/Book/BookReader";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<BookList />} />

        <Route path="/books/:id" element={<BookReader />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
