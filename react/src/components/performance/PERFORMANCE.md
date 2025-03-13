# React Performance Optimization Guide

## Table of Contents

1. [React.memo](#reactmemo)
2. [useMemo](#usememo)
3. [useCallback](#usecallback)
4. [Lazy Loading](#lazy-loading)
5. [Code Splitting](#code-splitting)

## React.memo

`React.memo` is a higher-order component that can wrap around a component to prevent unnecessary re-renders. However, it should be used strategically, not by default.

### When to Use memo

✅ **Good Use Cases**:

```jsx
// 1. Components that re-render frequently with the same props
const ExpensiveChart = memo(({ data }) => {
  // Complex calculations or rendering
  return <div>{/* Complex chart rendering */}</div>;
});

// 2. Components in a list
const TaskItem = memo(({ task, onToggle }) => {
  return <div onClick={() => onToggle(task.id)}>{task.text}</div>;
});

// 3. Pure components with simple props comparison
const PureComponent = memo(({ value }) => {
  return <div>{value}</div>;
});
```

❌ **Bad Use Cases**:

```jsx
// 1. Simple components with frequently changing props
const Counter = memo(({ count }) => {
  return <div>{count}</div>; // Props change on every render
});

// 2. Components with complex props that are always different
const BadExample = memo(({ data }) => {
  return <div>{data.timestamp}</div>; // New object on every render
});
```

### Performance Impact

```jsx
// Monitor renders with console.log
const Component = ({ data }) => {
  console.log("Component rendered");
  return <div>{/* rendering logic */}</div>;
};

// With memo
const MemoizedComponent = memo(({ data }) => {
  console.log("Memoized component rendered");
  return <div>{/* rendering logic */}</div>;
});
```

## useMemo

`useMemo` is used to memoize expensive calculations or values. It helps prevent unnecessary recalculations on every render.

### When to Use useMemo

✅ **Good Use Cases**:

```jsx
// 1. Expensive calculations
const ExpensiveComponent = ({ data }) => {
  const expensiveValue = useMemo(() => {
    return data.reduce((acc, item) => acc + complexCalculation(item), 0);
  }, [data]);

  return <div>{expensiveValue}</div>;
};

// 2. Preventing unnecessary child re-renders
const Parent = ({ items }) => {
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => b - a);
  }, [items]);

  return <ChildComponent items={sortedItems} />;
};
```

❌ **Bad Use Cases**:

```jsx
// 1. Simple calculations
const SimpleComponent = ({ count }) => {
  // Unnecessary use of useMemo
  const double = useMemo(() => count * 2, [count]);
  return <div>{double}</div>;
};
```

## useCallback Explained in Detail

`useCallback` is a hook that returns a memoized version of a callback that only changes if one of the dependencies has changed. It's particularly useful when:

1. Passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders
2. When the callback is used as a dependency in other hooks

### Practical Example 1: Without useCallback

```jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // This function is recreated on every render
  const handleClick = () => {
    setCount((c) => c + 1);
  };

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <ExpensiveChild onClick={handleClick} count={count} />
    </div>
  );
};

// Even with memo, ExpensiveChild will re-render on every parent render
// because handleClick is a new function each time
const ExpensiveChild = memo(({ onClick, count }) => {
  console.log("ExpensiveChild rendered");
  return (
    <div>
      <button onClick={onClick}>Count is: {count}</button>
    </div>
  );
});
```

### Practical Example 2: With useCallback

```jsx
const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // handleClick function is now memoized and only changes if dependencies change
  const handleClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []); // Empty dependency array because we're using the function updater form

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <ExpensiveChild onClick={handleClick} count={count} />
    </div>
  );
};

// Now ExpensiveChild only re-renders when count changes
const ExpensiveChild = memo(({ onClick, count }) => {
  console.log("ExpensiveChild rendered");
  return (
    <div>
      <button onClick={onClick}>Count is: {count}</button>
    </div>
  );
});
```

### Example 3: useCallback with Dependencies

```jsx
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  // This callback depends on the filter value
  const handleAddTodo = useCallback(
    (text) => {
      const newTodo = {
        id: Date.now(),
        text,
        completed: false,
        visible: filter === "all" ? true : false,
      };
      setTodos((prev) => [...prev, newTodo]);
    },
    [filter]
  ); // filter is a dependency

  return (
    <div>
      <TodoInput onAdd={handleAddTodo} />
      <FilterButtons onFilterChange={setFilter} />
      <TodoItems todos={todos} />
    </div>
  );
};
```

### Example 4: useCallback with Multiple Dependencies

```jsx
const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [preferences, setPreferences] = useState({});

  // This callback depends on both user and preferences
  const handleUpdateProfile = useCallback(() => {
    if (!user) return;

    const updatedUser = {
      ...user,
      preferences,
      lastUpdated: new Date(),
    };

    updateUserProfile(updatedUser);
  }, [user, preferences]); // Both user and preferences are dependencies

  return (
    <div>
      <UserProfile user={user} onUpdate={handleUpdateProfile} />
      <PreferencesForm
        preferences={preferences}
        onPreferencesChange={setPreferences}
      />
    </div>
  );
};
```

### Common Pitfalls and Solutions

1. **Unnecessary Usage**:

```jsx
// ❌ Bad: useCallback not needed
const SimpleComponent = () => {
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []);

  return <button onClick={handleClick}>Click me</button>;
};

// ✅ Good: Regular function is fine
const SimpleComponent = () => {
  const handleClick = () => {
    console.log("clicked");
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

2. **Missing Dependencies**:

```jsx
// ❌ Bad: Missing dependency
const Counter = ({ step }) => {
  const increment = useCallback(() => {
    setCount((c) => c + step);
  }, []); // step should be in dependencies

  // ✅ Good: Including necessary dependency
  const increment = useCallback(() => {
    setCount((c) => c + step);
  }, [step]);
};
```

3. **Using with Event Handlers**:

```jsx
// ❌ Bad: Unnecessary useCallback for simple event handler
const Form = () => {
  const handleChange = useCallback((e) => {
    setName(e.target.value);
  }, []);

  // ✅ Good: Regular function for simple event handler
  const handleChange = (e) => {
    setName(e.target.value);
  };
};
```

### Best Practices for useCallback

1. **Use with memo**:

```jsx
const Parent = () => {
  const handleClick = useCallback(() => {
    // handle click
  }, []);

  return <MemoizedChild onClick={handleClick} />;
};

const MemoizedChild = memo(({ onClick }) => {
  return <button onClick={onClick}>Click me</button>;
});
```

2. **Use when callback is a dependency**:

```jsx
const Component = () => {
  const handleData = useCallback(() => {
    // handle data
  }, []);

  useEffect(() => {
    // handleData is a dependency of this effect
    handleData();
  }, [handleData]);
};
```

Remember: Only use `useCallback` when there's a clear performance benefit. In most cases, regular functions are fine!

## Lazy Loading

Lazy loading is used to defer loading of components until they are needed.

### Implementation:

```jsx
// 1. Basic lazy loading
const Statistics = lazy(() => import("./Statistics"));

// 2. With Suspense
const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Statistics />
    </Suspense>
  );
};
```

## Code Splitting

Code splitting is a technique that allows you to split your JavaScript bundle into multiple chunks that are loaded on demand. This can significantly improve your application's initial load time by reducing the size of the main bundle.

### 1. Route-Based Code Splitting

This is the most common and practical way to implement code splitting. It splits your code based on routes, so each page loads only when needed.

```jsx
// ❌ Without Code Splitting - Everything loads at once
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

// ✅ With Code Splitting - Each page loads separately
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
};
```

### 2. Component-Based Code Splitting

Split large components that aren't immediately needed:

```jsx
// ❌ Without Code Splitting - Heavy component loads immediately
import HeavyDataGrid from "./components/HeavyDataGrid";
import HeavyChart from "./components/HeavyChart";

// ✅ With Code Splitting - Components load when needed
const HeavyDataGrid = lazy(() => import("./components/HeavyDataGrid"));
const HeavyChart = lazy(() => import("./components/HeavyChart"));

const Dashboard = () => {
  const [showGrid, setShowGrid] = useState(false);
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowGrid(true)}>Show Grid</button>
      <button onClick={() => setShowChart(true)}>Show Chart</button>

      {showGrid && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyDataGrid />
        </Suspense>
      )}

      {showChart && (
        <Suspense fallback={<LoadingSpinner />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
};
```

### 3. Feature-Based Code Splitting

Split code based on features that aren't used by all users:

```jsx
// AdminDashboard.jsx
const AdminFeatures = lazy(() => import("./features/AdminFeatures"));
const UserManagement = lazy(() => import("./features/UserManagement"));

const AdminDashboard = ({ user }) => {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      {user.hasAdminAccess && (
        <Suspense fallback={<LoadingSpinner />}>
          <AdminFeatures />
        </Suspense>
      )}

      {user.canManageUsers && (
        <Suspense fallback={<LoadingSpinner />}>
          <UserManagement />
        </Suspense>
      )}
    </div>
  );
};
```

### 4. Library Code Splitting

Split large third-party libraries:

```jsx
// ❌ Without Code Splitting - Large library loads immediately
import { Chart } from 'chart.js';
import { format } from 'date-fns';

// ✅ With Code Splitting - Libraries load when needed
const ChartComponent = lazy(() => {
  return import('chart.js').then(module => {
    // Return a component that uses Chart.js
    return {
      default: ({ data }) => {
        const chart = new module.Chart(/* ... */);
        return <canvas ref={/* ... */} />;
      }
    };
  });
});

const DateFormatter = lazy(() => {
  return import('date-fns').then(module => {
    return {
      default: ({ date }) => <span>{module.format(date, 'PP')}</span>
    };
  });
});
```

### 5. Conditional Code Splitting

Split code based on user conditions or device capabilities:

```jsx
// Split based on device type
const MobileView = lazy(() => import("./views/MobileView"));
const DesktopView = lazy(() => import("./views/DesktopView"));

const ResponsiveComponent = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {isMobile ? <MobileView /> : <DesktopView />}
    </Suspense>
  );
};

// Split based on user preferences
const LightTheme = lazy(() => import("./themes/LightTheme"));
const DarkTheme = lazy(() => import("./themes/DarkTheme"));

const ThemedComponent = ({ userPreferences }) => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      {userPreferences.darkMode ? <DarkTheme /> : <LightTheme />}
    </Suspense>
  );
};
```

### Best Practices

1. **Strategic Splitting**:

```jsx
// ❌ Too granular - Creates too many small chunks
const Button = lazy(() => import("./Button"));
const Input = lazy(() => import("./Input"));

// ✅ Better - Group related components
const FormComponents = lazy(() => import("./components/form"));
```

2. **Loading States**:

```jsx
// ✅ Create meaningful loading states
const LoadingSpinner = () => (
  <div className="loading-container">
    <CircularProgress />
    <p>Loading...</p>
  </div>
);

// Use it with Suspense
<Suspense
  fallback={<LoadingSpinner />}
  fallbackMinDuration={300} // Prevent flash of loading state
>
  <LazyComponent />
</Suspense>;
```

3. **Error Boundaries**:

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
      );
    }
    return this.props.children;
  }
}

// Use it with code splitting
<ErrorBoundary>
  <Suspense fallback={<LoadingSpinner />}>
    <LazyComponent />
  </Suspense>
</ErrorBoundary>;
```

4. **Preloading**:

```jsx
// Preload on hover
const HomePage = () => {
  const preloadDashboard = () => {
    const DashboardComponent = lazy(() => import("./Dashboard"));
  };

  return (
    <Link
      to="/dashboard"
      onMouseEnter={preloadDashboard}
      onTouchStart={preloadDashboard}
    >
      Go to Dashboard
    </Link>
  );
};
```

### Monitoring Split Points

You can use webpack's built-in features to analyze your bundle:

```bash
# Add to your package.json scripts
{
  "scripts": {
    "analyze": "webpack-bundle-analyzer build/bundle-stats.json"
  }
}
```

This will help you:

- Visualize bundle size
- Identify large dependencies
- Find opportunities for splitting

Remember: Code splitting is powerful but should be used judiciously. Too many split points can actually harm performance due to multiple network requests.

## Best Practices Summary

1. **React.memo**:

   - Use for components that re-render frequently with the same props
   - Use for components in lists
   - Avoid for simple components or when props change frequently

2. **useMemo**:

   - Use for expensive calculations
   - Use when memoized value is used by multiple child components
   - Avoid for simple calculations

3. **useCallback**:

   - Use when passing callbacks to optimized child components
   - Use when function is used as a dependency in other hooks
   - Avoid when function is only used in event handlers

4. **Lazy Loading**:

   - Use for large components not needed immediately
   - Use for routes in your application
   - Use with Suspense for loading states

5. **Code Splitting**:
   - Split code along routes
   - Split large libraries
   - Load features on demand

## Performance Monitoring

```jsx
// Add console.log to monitor renders
const Component = () => {
  console.log("Component rendered");
  return <div>Content</div>;
};

// Use React DevTools Profiler
// Use Performance tab in Chrome DevTools
// Use React's built-in Profiler component
```

Remember: Always measure performance before optimizing. Don't optimize prematurely!
