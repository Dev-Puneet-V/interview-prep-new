import React, { useState } from "react";

let totalRender = 0;

const FruitComponent = React.memo(({ fruit, index }) => {
  totalRender++;
  console.log("rendered", totalRender, fruit, index);
  return <div>{fruit + " " + index}</div>;
});

const ImportanceOfKey = () => {
  const [fruits, setFruits] = useState([
    { id: 1, name: "Mango" },
    { id: 2, name: "Apple" },
    { id: 3, name: "Banana" },
  ]);

  return (
    <div>
      {fruits.map((fruit, index) => (
        <FruitComponent key={fruit.id} fruit={fruit.name} index={fruit.id} />
      ))}
      <button
        onClick={() =>
          setFruits([
            { id: totalRender + 1, name: "Orange" + totalRender },
            ...fruits,
          ])
        }
      >
        Add Fruit
      </button>
    </div>
  );
};

export default ImportanceOfKey;

/**
 * Explanation of React.memo:
 *
 * - `React.memo` is a higher-order component that optimizes functional components
 *   by preventing unnecessary re-renders.
 *
 * - It works by memoizing the component, meaning it remembers the last rendered
 *   output and only re-renders if the component's props change.
 *
 * - By default, `React.memo` performs a shallow comparison of the component's props.
 *   If the props are the same (i.e., no changes in the values), the component will not re-render.
 *
 * - This optimization is particularly useful for components that receive the same props
 *   frequently or are part of a large list, as it can significantly improve performance.
 *
 * - In this example, `FruitComponent` is wrapped with `React.memo`, so it will only
 *   re-render if its `fruit` or `index` props change. This means that when a new fruit
 *   is added, only the new `FruitComponent` instance will render, and the existing ones
 *   will not re-render unless their props change.
 *
 * Explanation of Keys in React:
 *
 * - Keys are a crucial part of React's reconciliation process, which is how React
 *   updates the DOM to match the virtual DOM.
 *
 * - A key is a special string attribute you need to include when creating lists of elements.
 *   Keys help React identify which items have changed, been added, or been removed.
 *
 * - Using keys makes it easier for React to update the UI efficiently by allowing it
 *   to match elements in the current tree with elements in the previous tree.
 *
 * - Keys should be unique and stable. This means each key should uniquely identify an element
 *   and should not change between renders. A common practice is to use a unique ID from your data.
 *
 * - Avoid using indices as keys, especially if the list can change order or have items added/removed.
 *   Using indices can lead to performance issues and bugs because React may not correctly
 *   associate the component's state with the right element.
 *
 * - In this example, each fruit has a unique `id` used as the key, ensuring that React can
 *   efficiently update the DOM when the list changes, minimizing unnecessary re-renders.
 */
