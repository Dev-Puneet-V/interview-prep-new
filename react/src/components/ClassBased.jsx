import React from "react";
import Component from "react";
class ClassBased extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
    // The constructor is called before the component is mounted.
    // It's used to initialize state and bind methods.
  }

  componentDidMount() {
    console.log("componentDidMount");
    // componentDidMount is called immediately after the component is mounted.
    // It's a good place to initiate network requests or set up subscriptions.
    this.setState({ count: 1 });
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log("shouldComponentUpdate", this.state.count);
    // shouldComponentUpdate is called before rendering when new props or state are being received.
    // It returns a boolean value that determines whether the component should update.
    // Returning false will prevent the component from re-rendering.
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Component did update", this.state.count);
    // componentDidUpdate is called immediately after updating occurs.
    // It's a good place to perform operations after the component has been updated.
  }

  /**
   * componentWillUnmount is a lifecycle method in
   * React class components that is called just before
   * a component is unmounted and destroyed.
   * This method is part of the unmounting phase of the component lifecycle.
   */
  componentWillUnmount() {
    console.log("Component will unmount");
    // componentWillUnmount is called just before a component is unmounted and destroyed.
    // It's used for cleanup activities like clearing timers or canceling network requests.
  }

  render() {
    console.log("render", this.state.count);
    // render is the only required method in a class component.
    // It returns the JSX that defines the component's UI.
    return (
      <>
        <h1 onClick={() => this.setState({ count: 2 })}>Class Based</h1>
        <h2>Count: {this.state.count}</h2>
      </>
    );
  }
}

export default ClassBased;
