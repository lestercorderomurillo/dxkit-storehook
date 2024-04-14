# `zen-state`
zen-state is an observable global state management library designed for React, aimed at minimizing boilerplate while maximizing developer experience.

## List of features
- **Centralized State Management**: Provides a predictable global state reducer.
- **Best Practiques by Default**: Encourages developers to easily write optimistic updates by default.
- **Seamless React Integration**: Easily integrates with React Components using hooks.
- **High Performance**: Utilizes the modern signal-based architecture for efficiency.
- **Type-Safe Documentation**: Ensures 100% type safety through comprehensive documentation.
- **Low JS Bundle**: Less than 1KB footprint on your project bundle.


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

To begin, invoke the `createStoreHook` function to generate a new Hook. This fresh hook will be accessible universally, containing an array with your store state and an object with mutations. Integration with your ORM system, as well as fetch/submit operations, will be straightforward.

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
Then use the created hook in your components to access and call the mutations defined on your store.

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
