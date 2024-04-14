# `zen-state`
zen-state is an observable store library designed for React, aimed at minimizing boilerplate while maximizing developer experience.

## Features
- **Centralized State Management**: Provides a predictable global mutable state and encourages optimistic updates.
- **Seamless React Integration**: Easily integrates with React components using hooks for a lightweight footprint.
- **High Performance**: Utilizes a signal-based architecture for efficiency with minimal bundle size (1KB).
- **Type-Safe Documentation**: Ensures 100% type safety through comprehensive documentation.


## Installation

- npm
```sh
npm install zen-state
```
- Yarn
```sh
yarn add zen-state
```

## Usage

To start, call `createStore` to return a new Hook. This new hook can be accessed anywhere.

```jsx
import { createStore } from 'zen-state';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

type Book = {
  id: number;
  title: string;
  author: string;
};

export const useBookStore = createStoreHook<Book[]>({
  initialState: [
    { id: 1000, author: 'Lester', title: 'TestBook' }
  ],
  mutations: ({ current, set, optimistic }) => ({
    addBook: ({ book }) => set({ value: [...current(), { ...book, id: optimistic('id', 9999) }] }),
  }),
  subscriptions: ({ forward, rollback }) => ({
    addBook: {
      willCommit: async (book: Book) => {
        try {
          const res = await prisma.book.create({
            data: {
              title: book.title,
              author: book.author
            }
          });
          forward('id', res.id);
        } catch (error) {
          console.error('Error inserting book:', error);
          rollback();
        }
      },
      didCommit: (book: Book) => {
        console.log(`Book with id ${book.id} was inserted.`);
      },
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
      <button onClick={() => addBook({ title: "New Book", author: "New Author", genre: "New Genre" })}>
        Add Book
      </button>
    </div>
  );
}
```
