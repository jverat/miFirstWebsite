import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/navbar";
import Counters from "./components/counters";
import { CounterData } from "./components/counter";

export interface State {
    counters: CounterData[];
}

class App extends Component {

    state = {
        counters: [
            { key: 0, title: "titulo0", value: 0 },
            { key: 1, title: "titulo1", value: 0 },
            { key: 2, title: "titulo2", value: 0 },
            { key: 3, title: "titulo3", value: 0 },
            { key: 4, title: "titulo4", value: 0 },
            { key: 5, title: "titulo5", value: 0 },
        ],
    };

    handleDelete = (id: number): void => {
        let counters = this.state.counters.filter((value: CounterData) => value.key !== id);
        this.setState({ counters });
    };

    handleIncrement = (counter: CounterData): void => {
        // @ts-ignore
        this.state.counters.find(c => c.key === counter.key).value += 1;
        let counters = this.state.counters;
        this.setState({ counters });
    };

    handleNewCounter = () => {
        let counters = this.state.counters;
        counters.push({ key: this.state.counters.length, title: "mamarre", value: 0});
        this.setState({ counters });
    };

    render() {
    return (
        <React.Fragment>
          <NavBar totalCounters={this.state.counters.length}/>
          <main className="container">
            <Counters counters={this.state.counters} onIncrement={(counter: CounterData) => this.handleIncrement(counter)} onDelete={(counterKey: number) => this.handleDelete(counterKey)} onNewCounter={this.handleNewCounter}/>
          </main>
        </React.Fragment>
    );
  }
}

export default App;
