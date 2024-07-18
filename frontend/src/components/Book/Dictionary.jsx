// import React, { useState, useEffect } from "react";
// import api from "../../services/api";

// const Dictionary = () => {
//   const [dictionary, setDictionary] = useState([]);

//   useEffect(() => {
//     const fetchDictionary = async () => {
//       try {
//         const response = await api.get("/dictionary");
//         setDictionary(response.data);
//       } catch (error) {
//         console.error("Error fetching dictionary", error);
//       }
//     };

//     fetchDictionary();
//   }, []);

//   return (
//     <div>
//       <h2>My Dictionary</h2>
//       <ul>
//         {dictionary.map((entry, index) => (
//           <li key={index}>
//             {entry.word}: {entry.meaning}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Dictionary;
