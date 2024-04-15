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

To begin, call the `createStoreHook` function to generate a new Hook. Integration with your ORM system, as well as fetch/submit operations, will be straightforward with the subscriptions model to allow for easy optimistic updates by default.

```jsx
import { db } from './db';
import { createStore } from 'zen-state';

type Book = {
  id: number;
  title: string;
  author: string;
};

export const useBookStore = createStoreHook<Book[]>({
  initialState: [
    { 
      id: '3bd7ab65-fd3c-4c8e-af7e-0bf7541d2931', 
      title: '1984' 
      author: 'George Orwell', 
    }
  ],
  mutations: ({ current, set, optimistic }) => ({
    addBook: (book: Book) => set({ value: [...current(), { ...book, id: optimistic('id', undefined) }] }),
  }),
  subscriptions: ({ forward, rollback }) => ({
    addBook: {
      willCommit: async (book: Book) => {
        try {
          const res = await db.books.insert({
            title: book.title,
            author: book.author
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
This hook will be accessible universally, containing an array with your store state and an object with mutations to said store. 

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
