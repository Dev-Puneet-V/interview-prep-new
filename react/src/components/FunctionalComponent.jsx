import React, { useState, useEffect } from "react";

let totalRender = 0;

const FruitComponent = ({ fruit, index }) => {
  // Increment totalRender every time the component renders
  totalRender++;
  console.log("rendered", totalRender, fruit, index);
  return <div>{fruit + " " + index}</div>;
};

const FunctionalComponent = () => {
  const [fruits, setFruits] = useState([
    { id: 1, name: "Mango" },
    { id: 2, name: "Apple" },
    { id: 3, name: "Banana" },
  ]);

  // useEffect with an empty dependency array is equivalent to componentDidMount
  useEffect(() => {
    console.log("Component mounted");
    // Perform any setup tasks here, like fetching data or setting up subscriptions
    // This effect runs only once after the initial render

    // Return a cleanup function, equivalent to componentWillUnmount
    return () => {
      console.log("Component will unmount");
      // Perform any necessary cleanup here, such as clearing timers or canceling network requests
    };
  }, []);

  // useEffect with dependencies is equivalent to componentDidUpdate
  useEffect(() => {
    console.log("Fruits updated", fruits);
    // This effect runs every time the `fruits` state changes
  }, [fruits]);

  return (
    <div>
      {fruits.map((fruit) => (
        // Using a unique ID as a key ensures efficient rendering
        <FruitComponent key={fruit.id} fruit={fruit.name} index={fruit.id} />
      ))}
      <button
        onClick={() =>
          setFruits([{ id: totalRender + 1, name: "Orange" }, ...fruits])
        }
      >
        Add Fruit
      </button>
    </div>
  );
};

export default FunctionalComponent;

/**
 * Explanation of React Functional Component Lifecycle with Hooks:
 *
 * - Functional components use hooks to manage lifecycle events and state.
 *
 * - `useState` is a hook that allows you to add state to functional components.
 *   It returns a stateful value, and a function to update it.
 *
 * - `useEffect` is a hook that lets you perform side effects in function components.
 *   It can be used to mimic `componentDidMount`, `componentDidUpdate`, and `componentWillUnmount`.
 *
 * - To mimic `componentDidMount`, use `useEffect` with an empty dependency array `[]`.
 *   This will run the effect only once after the initial render.
 *
 * - To mimic `componentDidUpdate`, use `useEffect` with specific dependencies.
 *   The effect will run every time the specified dependencies change.
 *
 * - To perform cleanup (equivalent to `componentWillUnmount`), return a function from `useEffect`.
 *   This cleanup function will run when the component is unmounted or before the effect runs again.
 *
 * - Unlike class components, functional components do not have a direct equivalent to `componentDidCatch`.
 *   Error boundaries must be implemented using class components.
 */
