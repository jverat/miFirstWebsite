import React, { Component } from "react";
import Counter, {CounterData} from "./counter";

export interface Props {
    counters: CounterData[];
    onIncrement: (counter: CounterData) => void;
    onDelete: (counterKey: number) => void;
    onNewCounter: () => void;
}

class Counters extends Component<Props> {
  render() {
    return (
      <div>
        <button className="btn" onClick={this.props.onNewCounter}>New Counter</button>
        {this.props.counters.map((counter: CounterData) => {
          return (
            <Counter
              counter={counter}
              onDelete={() => this.props.onDelete(counter.key)}
              onIncrement={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>, c: CounterData) => this.props.onIncrement(c)}
            />
          );
        })}
      </div>
    );
  }
}

export default Counters;
