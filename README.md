<img src="xspectrum.png" alt="xspectrum" width="300"/>

xspectrum-state is an global state management for Modern React

The goal is of this project is to provide a simple to use, yet scalable solution for creating complex nested states that hold to modern React architectures, while ensuring the developer experience stays sane.

## Key features

- **Optimistic Updates**: Encourages developers to easily write optimistic updates by default.
- **High performance**: Utilizes the modern signal-based architecture for efficiency delivering fast updates to components.
- **Centralized state**: Provides a predictable global state through mutations and subscriptions.
- **Seamless integration**: Easily integrates using hooks.
- **Type-Safe documentation**: Type autocompletion and simple API.

## Installation

To install this library, you can run this command.

We highly recommend using yarn.


```sh
yarn add xspectrum-state
```

But you can still still though npm.

```sh
npm install xspectrum-state
```

## Usage

To begin, call the `createStoreHook` function to generate a new Hook. Provide a initialState and a set of mutations, that contains in the function being passed, the actions callback to perform the updates.

```jsx
import { createStoreHook } from "xspectrum-state";

type Book = {
  id: number;
  title: string;
  author: string;
  genre: string;
  publicationYear: number;
};

type AddBookParams = Omit<Book, 'id'>;
type RemoveBookParams = Pick<Book, 'id'>;

export const useBooks = createStoreHook({
  initialState: {
    books: [
      { id: 1, title: "War and Peace", author: "Leo Tolstoy", genre: "Historical Fiction", publicationYear: 1869 },
      { id: 2, title: "Crime and Punishment", author: "Fyodor Dostoevsky", genre: "Psychological Fiction", publicationYear: 1866 },
      { id: 3, title: "Pride and Prejudice", author: "Jane Austen", genre: "Romance", publicationYear: 1813 },
      { id: 4, title: "1984", author: "George Orwell", genre: "Dystopian Fiction", publicationYear: 1949 },
    ],
  },
  mutations: ({ get, set }) => ({
    addBook: (params: AddBookParams) => {
      const books = get().books;
      const id = books.length > 0 ? Math.max(...books.map(book => book.id)) + 1 : 1;
      set({
        path: "books",
        value: [...books, { id, ...params }],
      });
    },
    removeBook: ({ id }: RemoveBookParams) => {
      const books = get().books.filter((book) => book.id !== id);
      set({ path: "books", value: books });
    },
  }),
});
```

This hook will be accessible globally, containing an array with your store state and an object with mutations.

```jsx
import React from "react";
import { useBooks, AddBookParams, RemoveBookParams } from "./useBooks";

function Component() {
  const [{ books }, { addBook, removeBook }] = useBooks();

  return (
    <div>
      <h2>Books</h2>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author} ({book.publicationYear})
            <button onClick={() => removeBook({ id: book.id })}>Remove</button>
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          addBook({
            title: "New Book",
            author: "New Author",
            genre: "New Genre",
            publicationYear: 2024,
          })
        }
      >
        Add Book
      </button>
    </div>
  );
}

```

