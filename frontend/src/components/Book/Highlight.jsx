// import React, { useState } from "react";
// import api from "../../services/api";

// const Highlight = ({ bookId, onHighlight }) => {
//   const [selectedText, setSelectedText] = useState("");

//   const handleMouseUp = () => {
//     const text = window.getSelection().toString();
//     if (text) {
//       setSelectedText(text);
//     }
//   };

//   const handleHighlight = async () => {
//     try {
//       const response = await api.post(`/books/${bookId}/highlights`, {
//         text: selectedText,
//       });
//       onHighlight(response.data);
//       setSelectedText("");
//     } catch (error) {
//       console.error("Error highlighting text", error);
//     }
//   };

//   return (
//     <div onMouseUp={handleMouseUp}>
//       {selectedText && <button onClick={handleHighlight}>Highlight</button>}
//     </div>
//   );
// };

// export default Highlight;
