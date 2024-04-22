# `Zen State`

Zen State is an observable global state management library designed for React.
Aimed at minimizing boilerplate while maximizing developer experience.

## Features

- **Centralized State Management**: Provides a predictable global state reducer through mutations.
- **Best Practiques by Default**: Encourages developers to easily write optimistic updates by default.
- **Seamless React Integration**: Easily integrates with React Components using hooks.
- **High Performance**: Utilizes the modern signal-based architecture for efficiency.
- **Type-Safe Documentation**: Ensures 100% type autocompletion, to improve code experience.

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
type Friend = {
  id: number;
  firstName: string;
  lastName: string;
  status: "Online" | "Offline" | "Away";
}

export const useFriends = createStoreHook({
  initialState: {
    friends: [
      { id: 1, firstName: "Alice", lastName: "Johnson", status: "Online" },
      { id: 2, firstName: "Bob", lastName: "Smith", status: "Offline" },
      { id: 3, firstName: "Charlie", lastName: "Brown", status: "Away" },
      { id: 4, firstName: "Diana", lastName: "Garcia", status: "Online" },
      { id: 5, firstName: "Emily", lastName: "Davis", status: "Offline" },
      { id: 6, firstName: "Frank", lastName: "Martinez", status: "Online" },
      { id: 7, firstName: "Grace", lastName: "Anderson", status: "Online" },
      { id: 8, firstName: "Henry", lastName: "Thompson", status: "Away" },
    ],
  },
  mutations: ({ get, set, merge }) => ({
    addFriend: (friend: Friend) => {
      const friends = get().friends;
      set({ path: "friends", value: [...friends, friend] });
    },
    removeFriend: ({ friendId }: { friendId: number }) => {
      const friends = get().friends.filter((friend) => friend.id !== friendId);
      set({ path: "friends", value: friends });
    },
    updateStatus: ({ friendId, newStatus }: { friendId: number; newStatus: Friend["status"] }) => {
      const friends = get().friends.map((friend) => (friend.id === friendId ? { ...friend, status: newStatus } : friend));
      set({ path: "friends", value: friends });
    },
  })
});
```

This hook will be accessible globally, containing an array with your store state and an object with mutations to said store.

```jsx
import React from "react";
import { useFriends } from "./useFriends";

function Component() {
  const [{ friends }, { addFriend }] = useFriends();

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            {friend.firstName} {friend.lastName} - {friend.status}
          </li>
        ))}
      </ul>
      <button
        onClick={() =>
          addFriend({
            id: 9,
            firstName: "New",
            lastName: "Friend",
            status: "Online",
          })
        }
      >
        Add Friend
      </button>
    </div>
  );
}
```
