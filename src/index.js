import React from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios';
// import { Navbar, Jumbotron } from 'react-bootstrap';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './index.css';

const Stars = (props) => {
  let numberOfStars = 1 + Math.floor(Math.random()*9);

  let stars = [];
  for (let i=0; i<numberOfStars; i++){
    stars[i] = i;
  }

  return (
    <div className="col-5">
      {stars.map((i) => 
        <i key={i} className="fa fa-star"></i>
      )}
    </div>
  );
};

const Button = (props) => {
  return (
    <div className="col-2">
      <button>=</button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-5">
      <span>5</span>
      <span>6</span>
    </div>
  );
}

const Numbers = (props) => {
  return (
    <div className="card text-center">
      <div>
        {Numbers.list.map((number, i) =>
          <span key={i}>{number}</span>)}
      </div>
    </div>
  );
}

Numbers.list = [];
for(let i=0; i<9; i++) {
  Numbers.list[i] = i+1;
}

class Game extends React.Component {
  render () {
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <hr />
        <div className="row">
          <Stars />
          <Button />
          <Answer />
        </div>
        <br />
        <Numbers />
      </div>
    );
  }
}

class App extends React.Component {
  render () {
    return (
      <div>
        <Game />
      </div>
    );
  }
}


ReactDOM.render(<App />, document.getElementById('root'));