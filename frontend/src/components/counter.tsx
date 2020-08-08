import React, { Component } from "react";


export interface Props {
  counter: CounterData
  onDelete: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void);
  onIncrement: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, counter: CounterData) => void);
}

export interface CounterData {
    key: number;
    title: string;
    value: number;
}

class Counter extends Component<Props> {

  styles = {
    fontSize: "20px",
    fontWeight: "bold",
  } as React.CSSProperties;

  render() {
    return (
      <React.Fragment>
        <h6>{this.props.counter.title}</h6>
        <span className={this.getBadgeClasses()}>{this.formatValue()}</span>
        <button
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => this.props.onIncrement(e, this.props.counter)}
          className="btn btn-secondary btn-sm"
        >
          Increment
        </button>

        <button
          onClick={this.props.onDelete}
          className="btn btn-danger btn-sm m-2"
        >
          Delete
        </button>
      </React.Fragment>
    );
  }

  getBadgeClasses() {
    let classes = "badge m-2 badge-";
    return (classes += this.props.counter.value === 0 ? "warning" : "primary");
  }

  formatValue() {
    return this.props.counter.value === 0 ? "Zero" : this.props.counter.value;
  }
}

export default Counter;
