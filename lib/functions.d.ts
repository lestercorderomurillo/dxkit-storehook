import { MutationsSchema, Selector, Store, StoreSchema, SubscriptionsSchema } from "./types";
/**
 * Creates a store based on the provided schema.
 * @template TState The type of the state managed by the store.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @template TSubscriptions The type of subscriptions that can be attached to mutations.
 * @param {StoreSchema<TState, TMutations, TSubscriptions>} schema The schema defining the structure of the store.
 * @returns {Store<TState, TMutations>} A store object with specified state, mutations, and subscriptions.
 */
export declare const createStore: <TState = any, TMutations extends MutationsSchema = MutationsSchema, TSubscriptions extends SubscriptionsSchema<TMutations> = SubscriptionsSchema<TMutations>>(schema: StoreSchema<TState, TMutations, TSubscriptions>) => Store<TState, TMutations>;
/**
 * Generates a hook for interacting with a store based on the provided initial state schema.
 * @template TState The type of the state managed by the store.
 * @template TMutations The type of mutations that can be dispatched to the store.
 * @template TSubscriptions The type of subscriptions that can be attached to mutations.
 * @param {StoreSchema<TState, TMutations, TSubscriptions>} schema The schema defining the initial state of the store.
 */
export declare const createStoreHook: <TState = any, TMutations extends MutationsSchema = MutationsSchema, TSubscriptions extends SubscriptionsSchema<TMutations> = SubscriptionsSchema<TMutations>>(schema: StoreSchema<TState, TMutations, TSubscriptions>) => <TSlice = TState>(selector?: Selector<TState, TSlice>) => import("./types").useStoreReturn<TState, TSlice, TMutations>;
