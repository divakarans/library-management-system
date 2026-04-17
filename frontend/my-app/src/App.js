import { useEffect, useState } from "react";
import "./sty.css";

function App() {
  const [books, setBooks] = useState([]);
  const [search,setSearch]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [mode, setMode] = useState("title");
  const [newBook,setNewBook]=useState({
    Title: "",
    Author: "",
    Year: "",
    ISBN: ""
  });
const handleAddBook = () => {
    if (!newBook.Title.trim() || !newBook.Author.trim()) {
      alert("Title and Author are required");
      return;
    }
  fetch("http://127.0.0.1:5000/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newBook)
  })
    .then(res => res.json())
    .then(() => {
      setBooks([...books, newBook]); 
      setShowModal(false);
      setNewBook({ Title: "", Author: "", Year: "", ISBN: "" });
    });
  };
  
  useEffect(() => {
    fetch("http://127.0.0.1:5000/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .catch(err => console.log(err));
  }, []);

  const removeBook = (id) => {
  fetch(`http://127.0.0.1:5000/books/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      setBooks(books.filter(b => b.Id !== id));
    });
  };

const filteredBooks = books.filter((b) => {
  const value = search.toLowerCase();

  if (!value) return true;

  if (mode === "title") {
    return (b.Title || "").toLowerCase().includes(value);
  }

  if (mode === "author") {
    return (b.Author || "").toLowerCase().includes(value);
  }

  if (mode === "isbn") {
    return (b.ISBN || "").toString().includes(value);
  }

  return true;
});

  return (
    <div className="app">

      {/* Header */}
      <div className="header">
        <div>
          <h1>Book Archive</h1>
          <p>PERSONAL LIBRARY</p>
        </div>

        <div className="count-box">
          <h2>{books.length}</h2>
          <p>BOOKS</p>
        </div>
      </div>

      {/* Modes */}
      <div className="modes">
        <button
          className={`mode ${mode === "title" ? "active" : ""}`}
          onClick={() => setMode("title")}
        >
          By Title
        </button>

        <button
          className={`mode ${mode === "author" ? "active" : ""}`}
          onClick={() => setMode("author")}
        >
          By Author
        </button>

        <button
          className={`mode ${mode === "isbn" ? "active" : ""}`}
          onClick={() => setMode("isbn")}
        >
          By ISBN
        </button>
      </div>

      {/* Search */}
      <div className="search-box">
        <input placeholder={`Search by ${mode}...`} value={search} onChange={(e)=> setSearch(e.target.value)}/>
      </div>

      {/* Books */}
      <div className="books">
        {filteredBooks.map((b, i) => (
          <div key={i} className="card">

            <div className="card-top">
              <h3>{b.Title}</h3>
              <span>#{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className="tags">
              <span>author {b.Author}</span>
              <span>year {b.Year}</span>
            </div>

            <div className="tags">
              <span>isbn {b.ISBN}</span>
            </div>

            <button className="remove-btn"
              onClick={() => removeBook(b.Id)}
            >
              Remove
            </button>

          </div>
        ))}
      </div>

      {/* Floating button */}
      <button className="fab" onClick={()=> setShowModal(true)}>+</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add Book</h2>

            <input
              placeholder="Title"
              onChange={(e) => setNewBook({ ...newBook, Title: e.target.value })}
            />

            <input
              placeholder="Author" 
              onChange={(e) => setNewBook({ ...newBook, Author: e.target.value })}
            />

            <input
              placeholder="Year"
              onChange={(e) => setNewBook({ ...newBook, Year: e.target.value })}
            />

            <input
              placeholder="ISBN"
              onChange={(e) => setNewBook({ ...newBook, ISBN: e.target.value })}
            />

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Cancel</button>
              <button onClick={handleAddBook}>Add</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;