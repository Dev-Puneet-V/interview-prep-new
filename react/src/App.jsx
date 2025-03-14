import "./App.css";
import { useState } from "react";
import ClassBased from "./components/ClassBased";
import ImportanceOfKey from "./components/ImportanceOfKey";
import PerformanceDemo from "./components/performance/PerformanceDemo";
import ReduxApp from "./redux-example/ReduxApp";

function App() {
  const [currentDemo, setCurrentDemo] = useState("performance");

  return (
    <>
      <div className="demo-selector">
        <button
          className={currentDemo === "performance" ? "active" : ""}
          onClick={() => setCurrentDemo("performance")}
        >
          Performance Demo
        </button>
        <button
          className={currentDemo === "redux" ? "active" : ""}
          onClick={() => setCurrentDemo("redux")}
        >
          Redux Demo
        </button>
        <button
          className={currentDemo === "key" ? "active" : ""}
          onClick={() => setCurrentDemo("key")}
        >
          Key Demo
        </button>
        <button
          className={currentDemo === "class" ? "active" : ""}
          onClick={() => setCurrentDemo("class")}
        >
          Class Demo
        </button>
      </div>

      {currentDemo === "performance" && <PerformanceDemo />}
      {currentDemo === "redux" && <ReduxApp />}
      {currentDemo === "key" && <ImportanceOfKey />}
      {currentDemo === "class" && <ClassBased />}
    </>
  );
}

export default App;
