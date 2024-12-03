import React, { useEffect, useState } from 'react';
import { fetchBooks } from '../services/api';
import Book from '../components/Book';
import HorizontalScroll from '../components/HorizontalScroll';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../css/Home.css';

function Home() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(8); // Set page size to a fixed value

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });

    const fetchBooksData = async () => {
      try {
        const data = await fetchBooks({ page, pageSize });
        setBooks(data.books);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooksData();
  }, [page, pageSize]);

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };

  return (
    <div className='home-body'>
      <header className='home-header'>
        <div className='home-header-content'>
          <h1 data-aos='fade-down'>Welcome to The Book Haven</h1>
          <p data-aos='fade-up'>Unleash your imagination with our curated collection</p>
        </div>
      </header>
      <div className="book-list-container" data-aos='fade-up'>
        <h2>Explore Our Collection</h2>
        <HorizontalScroll>
          {books.map((book) => (
            <Book key={book._id} book={book} />
          ))}
        </HorizontalScroll>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={page === 1} className="pagination-button">
            Previous
          </button>
          <span className="pagination-info">Page {page} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={page === totalPages} className="pagination-button">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
