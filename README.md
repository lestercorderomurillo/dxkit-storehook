# `Reflow`
Reflow is an observable store library designed for React, aimed at minimizing boilerplate while maximizing developer experience.

## Features
- **Predictable global mutable state**: Provides a centralized state management solution.
- **Optimistic updates by default**: Encourages developers to write optimistic updates.
- **Hook-like usage for seamless integration with React Components**: Easily integrate with React components using hooks.
- **Signal-based for high performance**: Offers high performance through a signal-based architecture.
- **100% Typesafe documentation**: Ensures type safety with comprehensive documentation.
- **Lightweight (1KB bundle size)**: Keeps your bundle size minimal for better performance.


## Installation

# npm
```sh
npm install reflow
```
# Yarn
```sh
yarn add reflow
```

## Usage

To start, call `createStoreHook` to return a new Hook. This new hook can be accessed anywhere.

```jsx
import { createStoreHook } from "reflow";

export const useBookStore = createStoreHook({
  initialState: {
    books: [
      { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction" },
      { id: 2, title: "1984", author: "George Orwell", genre: "Science Fiction" },
      { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction" },
      { id: 4, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance" },
    ],
  },
  mutations: ({ state, merge, set }) => ({
    addBook: (newBook) => {
      merge({ books: [...state().books, newBook] });
    },
    updateBook: (bookId, updatedFields) => {
      merge({
        books: state().books.map((book) => {
          if (book.id === bookId) {
            return { ...book, ...updatedFields };
          }
          return book;
        }),
      });
    },
    removeBook: (bookId) => {
      set({ path: "books", value: state().books.filter((book) => book.id != bookId) });
    },
  }),
});
```
Then use the created hook in your components to access and modify the store state.

```jsx
import React from 'react';
import { useBookStore } from './useBookStore';

function Component() {
  const [bookStore, { addBook }] = useBookStore();

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {bookStore.books.map(book => (
          <li key={book.id}>{book.title} by {book.author}</li>
        ))}
      </ul>
      <button onClick={() => addBook({ id: 5, title: "New Book", author: "New Author", genre: "New Genre" })}>
        Add Book
      </button>
    </div>
  );
}
```
