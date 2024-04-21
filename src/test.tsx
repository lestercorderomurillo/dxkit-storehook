import { createStore, createStoreHook } from "./functions";

const store = createStore({initialState: []});
store.mutations.addFriend({id: 1});

const useFriends = createStoreHook({
    initialState: {
      current: {
        nested: {
            val1: 1,
            val2: 2
        }
      },
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
      addFriend: ({ friend }) => {
        const friends = get().friends;
        set({ path: "friends", value: [...friends, friend] });
      },
      removeFriend: ({ friendId }) => {
        const friends = get().friends.filter(
          (friend) => friend.id !== friendId
        );
        set({ path: "friends", value: friends });
      },
      updateStatus: ({ friendId, newStatus }) => {
        const friends = get().friends.map((friend) =>
          friend.id === friendId ? { ...friend, status: newStatus } : friend
        );
        set({ path: "friends", value: friends });
      },
    }),
  });

  import React from 'react';

  function Component() {
    const [{friends}, {addFriend}] = useFriends();
  
    return (
      <div>
        <h2>Friends</h2>
        <ul>
          {friends.map(friend => (
            <li key={friend.id}>
              {friend.firstName} {friend.lastName} - {friend.status}
            </li>
          ))}
        </ul>
        <button onClick={() => addFriend({ id: 9, firstName: "New", lastName: "Friend", status: "Online" })}>
          Add Friend
        </button>
      </div>
    );
  }