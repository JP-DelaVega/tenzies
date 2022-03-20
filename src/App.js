import './App.css';
import Die from './components/Die'
import React from "react"
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'
import Records from './components/Records'
function App() {
  const [rollCount, setRollCount] = React.useState(0)
  const [dice, setDice] = React.useState(ranNum())
  const [tenzies, setTenzies] = React.useState(false)
  const [time, setTime] = React.useState({ ms: 0, s: 0, m: 0, h: 0 })
  const [interv, setInterv] = React.useState()
  const [status, setStatus] = React.useState(false)
  const [bestTracker, setBestTracker] = React.useState(0)
  const [modal, setModal] = React.useState(false)
  let myLocalStorage = JSON.parse(localStorage.getItem('record'))

  React.useEffect(() => {
    const allTrue = dice.every(die => die.isHeld === true)
    const allEqual = dice.every(die => die.value === dice[0].value)
    if (allTrue && allEqual) {
      /************************setting up the timer***************************/
      const hour = time.h > 10 ? time.h : "0" + time.h
      const minute = time.m > 10 ? time.m : "0" + time.m
      const seconds = time.s > 10 ? time.s : "0" + time.s
      const mili = time.ms > 10 ? time.ms : "0" + time.ms
      const totalTime = hour + " : " + minute + " : " + seconds + " : " + mili
      const myRecord = {
        myRoll: rollCount,
        myTotalTime: totalTime,
        myBestTracker: bestTracker
      }

      /***Adding to Local Storage**/
      let collection
      if (myLocalStorage === null) {
        collection = []
      } else {
        collection = myLocalStorage
      }
      collection.push(myRecord)
      localStorage.setItem("record", JSON.stringify(collection))
      
      setTenzies(true)
      stop()
    }

  }, [dice]);

  function ranNum() {
    const nums = []
    for (let index = 0; index < 10; index++) {
      const randomNum = Math.floor(Math.random() * 6) + 1;
      nums.push({
        value: randomNum,
        isHeld: false,
        id: nanoid()
      })
    }
    return (nums)
  }
  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?{ ...die, isHeld: !die.isHeld } : die
    }))
  }
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }
  function roll() {
    setDice(oldDice => oldDice.map(die => {
      return die.isHeld == true ? die : generateNewDie()
    }))
  }
  const dies = dice.map(
    item => {
      return (
        <Die key={item.id} num={item.value} isHeld={item.isHeld} holdDice={() => holdDice(item.id)} status={status} />
      )
    }
  )
  /***************Sorting of the records********************/
  if (myLocalStorage != null) {
    myLocalStorage.sort((a, b) => {
      if (a.myBestTracker < b.myBestTracker) {
        return -1
      }
      if (a.myBestTracker > b.myBestTracker) {
        return 1
      }
      return 0
    })
  }
  let num = 0
  let display
  /****************Displaying of the records*******************/
  if (myLocalStorage != null) {
    display = myLocalStorage.map(
      item => {
        num++
        if (num < 11) {
          return (
            <Records rollCount={item.myRoll} totalTime={item.myTotalTime} top={num} key={item.id}/>
          )
        }
      }
    )
  }
  
  function endGame() {
    if (!tenzies) {
      setRollCount(prevState => prevState + 1)
      return roll()
    }
    else {
      /*************Reseting the game if the user hit yes**********************/
      if (window.confirm("Are you sure you want to start new game?") == true) {
        setTenzies(prevState => !prevState)
        setDice(ranNum())
        setRollCount(0)
        setTime({ ms: 0, s: 0, m: 0, h: 0 })
        setBestTracker(0)
        setStatus(false)
      }
      else {
        return
      }
    }
  }
/**************For time Timer*********************/
  let UpdatedMS = time.ms,
    UpdatedS = time.s,
    UpdatedM = time.m,
    UpdatedH = time.h

  const start = () => {
    setStatus(true)
    run()
    setInterv(setInterval(run, 10))
  }
  const run = () => {

    if (UpdatedM === 60) {
      UpdatedH++;
      UpdatedM = 0;
    }
    if (UpdatedS === 60) {
      UpdatedM++;
      UpdatedS = 0;
    }
    if (UpdatedMS === 60) {
      UpdatedS++;
      setBestTracker(prevState => prevState + 1)
      UpdatedMS = 0;
    }
    UpdatedMS++
    return setTime({ ms: UpdatedMS, s: UpdatedS, m: UpdatedM, h: UpdatedH, id: nanoid() })
  }
  const stop = () => {
    clearInterval(interv)
  }
  function myModal() {
    setModal(prevState => !prevState)
  }
  
  return (
    <div className='content'>
      <div className='tracker'>
        <div className='leftTracker'>
          <div className='Score'>Score:</div>
          <div className='roll'>Roll Count: {rollCount}</div>
          <div className='time'>
            <span>Time: </span>
            <span>{time.h > 10 ? time.h : "0" + time.h}: </span>
            <span> {time.m > 10 ? time.m : "0" + time.m}: </span>
            <span> {time.s > 10 ? time.s : "0" + time.s}: </span>
            <span> {time.ms > 10 ? time.ms : "0" + time.ms}</span>
          </div>
        </div>
        <div className='rightTracker'>
          <img src={require('./dice/trophy.png')} onClick={myModal} />
        </div>
      </div>
      <main>
        {tenzies && <Confetti className='confetti' />}
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same.
          Click each die to freeze it at its current value between rolls.</p>
        <div className='dice'>{dies}</div>
        {status ? <button onClick={endGame}>{tenzies ? "New Game" : "Roll"}</button> : <button onClick={start}>Start Game</button>}
      </main>
      {modal && <div className='record'> 
      <h1>TOP 10</h1>
      <hr /> 
      <div className='identifier'>Top&emsp;&nbsp;&nbsp;Roll&nbsp;&nbsp;&nbsp; Time</div>
      {display}
      </div>}
    </div>
  );
}

export default App;
