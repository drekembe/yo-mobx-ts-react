import React, { MouseEventHandler } from 'react';
import './App.css';
import { Store, Messages } from './store';
import { Observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

const store = new Store()

class App extends React.Component {
  // We can use local state on components
  @observable public localFoo: string = 'hello'
  @action public addToFoo = (x: string) => {
    this.localFoo = this.localFoo + x
  }

  // And combine store state and local state in computeds
  @computed public get someComputed(): string {
    return `${this.localFoo}/${store.sum}`
  }

  public onMouseMove: MouseEventHandler = e => {
    store.setMouse(e.screenX, e.screenY)
  }

  public render = () => {
    return (
      <div className="App" onMouseMove={this.onMouseMove}>
        <Observer>
          {() => <div>
            <button onClick={() => this.addToFoo('!')}>{this.someComputed}</button>
            <button onClick={store.incHa}>ha: ({store.ha}) incHa</button>
            <button onClick={store.incMoo}>moo: ({store.moo}) incMoo</button>
            <button onClick={store.resetBoth}>reset</button>
            <button onClick={store.fetchPeople} disabled={store.fetchingPpl}>fetch people (now {store.numPpl})</button>
            <div>moo + ha = {store.sum}</div>
            <div>MouseX: {store.mouseX}, mouseY: {store.mouseY}, {store.mouseBig && `🐁`}</div>
            <MessageDisplay messages={store.msgs} />
          </div>
          }
        </Observer>
      </div>
    );
  }
}


// You can also use function components (React.FC) and give them proptypes
type MessageDisplayProps = {
  messages: Messages;
}
const MessageDisplay: React.FC<MessageDisplayProps> = ({ messages }) => 
  <Observer>
    {() => 
      <ul>
        {[...messages.entries()].map(([key, msg]) => <li key={key}>{key}. {msg}</li>)}
      </ul>
    }
  </Observer>

export default App;
