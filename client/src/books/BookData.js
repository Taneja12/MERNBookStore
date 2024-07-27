
export const getBooks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(books);
    }, 500);
  });
};

export const getBookDetails = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books.find((book) => book.id === id); // Compare without converting 'id'
      if (book) {
        resolve(book);
      } else {
        reject(new Error(`Book with id ${id} not found`)); // Handle case where book is not found
      }
    }, 500); // Simulating delay
  });
};

export const searchBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
      resolve(filteredBooks);
    }, 500); // Simulate async fetch
  });
};

