import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  increment,
  decrement,
  reset,
  setValue,
} from "../../store/counter/counterReducer";

const CounterContainer = () => {
  const { value, lastAction } = useSelector((state) => state.counter);
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  const handleSetValue = () => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      dispatch(setValue(numValue));
      setInputValue("");
    }
  };

  return (
    <div className="counter-container card">
      <h2 className="section-title">Basic Redux Example: Counter</h2>

      <div className="explanation">
        <p>This example demonstrates basic Redux concepts:</p>
        <ul>
          <li>Simple actions and reducers</li>
          <li>Using useSelector to access state</li>
          <li>Using useDispatch to dispatch actions</li>
        </ul>
      </div>

      <div className="counter-value">{value}</div>

      {lastAction && (
        <div className="alert">
          Last action: <strong>{lastAction}</strong>
        </div>
      )}

      <div className="counter-buttons">
        <button
          className="btn btn-primary"
          onClick={() => dispatch(decrement())}
        >
          Decrement
        </button>
        <button className="btn btn-danger" onClick={() => dispatch(reset())}>
          Reset
        </button>
        <button
          className="btn btn-primary"
          onClick={() => dispatch(increment())}
        >
          Increment
        </button>
      </div>

      <div className="form-group" style={{ marginTop: "20px" }}>
        <label>Set specific value:</label>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="number"
            className="form-control"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="btn btn-success" onClick={handleSetValue}>
            Set Value
          </button>
        </div>
      </div>

      <div className="code-block">
        <pre>{`
// Dispatching actions
dispatch(increment());
dispatch(decrement());
dispatch(reset());
dispatch(setValue(10));

// Accessing state
const { value } = useSelector(state => state.counter);
        `}</pre>
      </div>
    </div>
  );
};

export default CounterContainer;
