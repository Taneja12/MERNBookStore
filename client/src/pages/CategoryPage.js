import React from 'react';
import { useParams } from 'react-router-dom';
import { fetchBooksByCategory } from '../services/api';
import Book from '../components/Book';
import '../css/CategoryPage.css';

function CategoryPage() {
  const { categoryName } = useParams();
  const [books, setBooks] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchBooksByCategory(categoryName);
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books by category:', error);
      }
    };

    fetchData();
    
  }, [categoryName]);

  return (
    <div className="body">
      <div className="background-image" />
      <div className="book-list-container">
        <h2>{categoryName} Books</h2>
        <div className="book-list">
          {books.map((book) => (
            <div key={book._id} className="book-item">
              <Book book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
