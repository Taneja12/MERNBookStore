// SearchResults.js

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchBooksByTitle } from '../services/api'; // Adjust path if necessary
import Book from '../components/Book'; // Ensure the Book component is correctly imported
import '../css/SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (query) {
      searchBooksByTitle(query)
        .then((results) => {
          setSearchResults(Array.isArray(results) ? results : [results]); // Ensure results are an array
        })
        .catch((error) => {
          console.error('Error searching books:', error);
          setSearchResults([]);
        });
    }
  }, [query]);

  return (
    <div className="search-results">
      <h2 className="search-title">Search Results for "{query}"</h2>
      <div className="books-container">
        {searchResults.length ? (
          searchResults.map((book) => (
            <Book key={book._id} book={book} />
          ))
        ) : (
          <p>No books found for "{query}"</p>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
