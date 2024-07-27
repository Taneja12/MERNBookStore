import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../services/api'; // Import fetchBooks function from API service
import Book from '../components/Book'; // Import your Book component
import '../css/Home.css'; // Import your CSS file for styling

function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const pageSize = 4; // Number of items per page

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const data = await fetchBooks({ page, pageSize }); // Fetch books for current page and page size
        setBooks(data.books); // Set fetched books
        setTotalPages(data.totalPages); // Set total pages from API response
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooksData(); // Fetch books when component mounts or page changes
  }, [page]); // Trigger useEffect when page changes

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages)); // Increment page number, limited by totalPages
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1)); // Decrement page number, but not below 1
  };

  return (
    <div className='body'>
      <div className='background-image1'></div>
      <div className='container'>
        <p>Welcome To</p>
        <p>The Book Haven</p>
      </div>
      <div className="book-list-container">
        <h1 style={{fontFamily:'-moz-initial'}}>Our Books</h1>
        <div className="book-list">
          {books.map((book) => (
            <Book key={book._id} book={book} />
          ))}
        </div>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1} className="pagination-button">
            Previous
          </button>
          <span className="pagination-info">Page {page} of {totalPages}.</span>
          <button onClick={handleNextPage} disabled={page === totalPages} className="pagination-button">
            Next
          </button>
          {/* <button onClick={() => setPage(totalPages)} disabled={page === totalPages} className="pagination-button">
            Last &raquo;
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
