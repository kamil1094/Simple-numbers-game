import React from 'react';
import ReactDOM from 'react-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import './index.css';
const possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) { return true; }
  if (arr[0] > n) { return false; }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length, combinationsCount = (1 << listSize)
  for (var i = 1; i < combinationsCount ; i++ ) {
    var combinationSum = 0;
    for (var j=0 ; j < listSize ; j++) {
      if (i & (1 << j)) { combinationSum += arr[j]; }
    }
    if (n === combinationSum) { return true; }
  }
  return false;
};

const Stars = (props) => {
  let stars = [];
  for (let i=0; i<props.stars; i++){
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
  const handleClick = () => {
    props.redraw();
    props.startTimer();
  }
  let button;
  switch(props.answerIsCorrect) {
    case true:
      button = 
        <button className="btn btn-success" onClick={props.acceptAnswer}>
          <i className="fa fa-check"></i>
        </button>;
      break;
    case false:
      button = 
        <button className="btn btn-danger">
          <i className="fa fa-times"></i>
        </button>;
      break;
    default:
      button =
        <button className="btn btn-primary" 
        disabled={props.selectedNumbers.length === 0}
        onClick={props.checkAnswer}>
        =
        </button>;
      break;
  }
  return (
    <div className="col-2 text-center">
      {button}
      <br /><br />
      <button className="btn btn-warning btn-sm" 
        onClick={handleClick} 
        disabled={props.redraws === 0}>
          <i className="fa fa-refresh"></i>
          {props.redraws}
      </button>
    </div>
  );
}

const Answer = (props) => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((number, i) => 
        <span key={i}
          onClick={() => props.unselectNumber(number)}
        >{number}</span>
      )}
    </div>
  );
}

const Numbers = (props) => {
  const list = [];
  for(let i=0; i<9; i++) {
    list[i] = i+1;
  }
  const handleClick = (number) => {
    props.selectNumber(number);
    props.startTimer();
  }
  const numberClassName = (number) => {
    if(props.usedNumbers.indexOf(number) >= 0) {
      return 'used';
    } 
    if(props.selectedNumbers.indexOf(number) >= 0) {
      return 'selected';
    } 
  }

  return (
    <div className="card text-center">
      <div>
        {list.map((number, i) =>
          <span key={i} className={numberClassName(number)}
            onClick={() => handleClick(number)}
          >{number}</span>)}
      </div>
    </div>
  );
}

const Timer = (props) => {
  const checkTimerStatus = (time) => {
    if (time >= 15) return 'btn btn-primary'
    if (time >= 5 && time < 15) return 'btn btn-alert'
    if (time < 5) return 'btn btn-danger'
  }
  return (
    <div>
      <button disabled className={checkTimerStatus(props.time)} onClick={props.startTimer}>
      {props.time}
      </button>
    </div>
    
  )
}

const DoneFrame = (props) => {
  return (
    <div className="text-center">
    <h2>{props.doneStatus}</h2>
    <button className="btn btn-secondary" onClick={props.resetGame}>Play Again</button>
    </div>
  )
}

class Game extends React.Component {
  static randomNumber = () => 1 + Math.floor(Math.random()*9);
  static initialState = () => ({
    selectedNumbers: [],
    randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    usedNumbers: [],
    redraws: 5,
    doneStatus: null,
    time: 15,
    running: false
  });

  state = Game.initialState();

  resetGame = () => this.setState(Game.initialState());

  selectNumber = (clickedNumber) => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
    if (this.state.usedNumbers.indexOf(clickedNumber) >= 0) { return; }
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
    }));
  };

  unselectNumber = (clickedNumber) => {
    this.setState(prevState => ({
      answerIsCorrect: null,
      selectedNumbers: prevState.selectedNumbers
        .filter(number => number !== clickedNumber)
    }))
  }

  checkAnswer = () => {
    const addBonusTime = () => {
      this.setState(prevState => {
        if(prevState.answerIsCorrect === true) return {time: prevState.time + 10}
      });
    }
    this.setState(prevState => ({
      answerIsCorrect: prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0),
    }), addBonusTime);
  }

  acceptAnswer = () => {
    this.setState(prevState => ({
      usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber()
    }), this.updateDoneStatus);
  }

  redraw = () => {
    if (this.state.redraws === 0) return;
    this.setState(prevState => ({
      selectedNumbers: [],
      answerIsCorrect: null,
      randomNumberOfStars: Game.randomNumber(),
      redraws: prevState.redraws - 1
    }), this.updateDoneStatus);
  }

  possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
    const possibleNumbers = [];
    for(let i=0; i<9; i++){
      possibleNumbers[i] = i+1;
    }

    let possible = possibleNumbers.filter(number => 
      usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possible, randomNumberOfStars);
  }

  updateDoneStatus = () => {
    this.setState(prevState => {
      if(prevState.usedNumbers.length === 9) {
        return {
          doneStatus: 'Done. Nice!',
          time: 0
        };
      }
      if(prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return {
          doneStatus: 'Game Over!',
          time: 0
        };
      }
    })
  }

  
  startTimer = () => {
    let time;

    const setTimer = () => {
      let interval = setInterval(() => {
        this.setState(prevState => {
          if(this.state.time === 0) {
            clearInterval(interval);
            return {doneStatus: 'Game Over!'};
          } else {
            time = prevState.time - 1;
            return {time: time};
          }
        });
      }, 1000);
    }
    
    if(this.state.running === true) return;
    this.setState(prevState => ({
      running: true
    }), setTimer);    
  }

  render () {
    const {
      selectedNumbers, 
      randomNumberOfStars, 
      answerIsCorrect,
      usedNumbers,
      redraws,
      doneStatus,
      time
    } = this.state;
    return (
      <div className="container">
        <h3>Play Nine</h3>
        <Timer time={time} startTimer={this.startTimer}/>
        <hr />
        <div className="row">
          <Stars stars={randomNumberOfStars} />
          <Button 
            selectedNumbers={selectedNumbers} 
            checkAnswer={this.checkAnswer}
            answerIsCorrect={answerIsCorrect}
            acceptAnswer={this.acceptAnswer}
            redraw={this.redraw}
            redraws={redraws}
            startTimer={this.startTimer}
          />
          <Answer 
            selectedNumbers={selectedNumbers} 
            unselectNumber={this.unselectNumber}
          />
        </div>
        <br />
        <br />
        {doneStatus ?
          <DoneFrame resetGame={this.resetGame} doneStatus={doneStatus}/> :
          <Numbers 
            selectedNumbers={selectedNumbers}
            selectNumber={this.selectNumber}
            usedNumbers={usedNumbers}
            startTimer={this.startTimer}
          />
        }
        
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