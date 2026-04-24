import { useEffect, useState } from "react";
import "./sty.css";

function App() {
  const [books, setBooks] = useState([]);
  const [search,setSearch]=useState("");
  const [showModal,setShowModal]=useState(false);
  const [mode, setMode] = useState("title");
  const [editId, setEditId] = useState(null);
  const [newBook,setNewBook]=useState({
    Title: "",
    Author: "",
    Year: "",
    ISBN: "",
    ImageURL:""
  });
const handleAddBook = () => {
  if (!newBook.Title.trim() || !newBook.Author.trim()) {
    alert("Title and Author are required");
    return;
  }

  const url = editId
    ? `http://127.0.0.1:5000/books/${editId}`
    : "http://127.0.0.1:5000/books";

  const method = editId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newBook)
  })
    .then(res => res.json())
    .then(() => {
      fetch("http://127.0.0.1:5000/books")
        .then(res => res.json())
        .then(data => {
          setBooks(data);
          setShowModal(false);
          setEditId(null);

          setNewBook({
            Title: "",
            Author: "",
            Year: "",
            ISBN: "",
            ImageURL: ""
          });
        });
    });
};


  useEffect(() => {
    fetch("http://127.0.0.1:5000/books")
      .then(res => res.json())
      .then(data => setBooks(data))
      .then(data => console.log(data))
  }, []);

  const removeBook = (id) => {
  fetch(`http://127.0.0.1:5000/books/${id}`, {
    method: "DELETE"
  })
    .then(() => {
      setBooks(books.filter(b => b.id !== id));
    });
  };

const editBook = (book) => {
  setEditId(book.id);

  setNewBook({
    Title: book.title,
    Author: book.author,
    Year: book.year,
    ISBN: book.isbn,
    ImageURL: book.image_url
  });

  setShowModal(true);
};


const filteredBooks = books.filter((b) => {
  const value = search.toLowerCase();

  if (!value) return true;

  if (mode === "title") {
    return (b.title || "").toLowerCase().includes(value);
  }

  if (mode === "author") {
    return (b.author || "").toLowerCase().includes(value);
  }

  if (mode === "isbn") {
    return (b.isbn || "").toString().includes(value);
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

            {b.image_url && (
              <img
                src={b.image_url}
                alt={b.title}
                className="book-image"
              />
            )}

            <div className="card-top">
              <h3>{b.title}</h3>
              <span>#{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className="tags">
              <span>author {b.author}</span>
              <span>year {b.year}</span>
            </div>

            <div className="tags">
              <span>isbn {b.isbn}</span>
            </div>

            <div className="card-actions">
              <button
                className="edit-btn"
                onClick={() => editBook(b)}
              >
                Edit
              </button>

              <button
                className="remove-btn"
                onClick={() => removeBook(b.id)}
              >
                Remove
              </button>
            </div>

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

            <input
              placeholder="ImageURL"
              onChange={(e) => setNewBook({ ...newBook, ImageURL: e.target.value })}
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