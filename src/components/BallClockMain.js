import React, {useState} from 'react'
import Input from './Input'
import findCompleteCycle from '../lib/BallClock'

export default function BallClockMain(props) {

  const [inputs,setInputs] = useState([]) // stores inputs
  const [results,setResults] = useState([])  // stores results
  const [clockBalls,setClockBalls] = useState('') // for input

  // look for enter key on input
  const clockBallsOnKeyPressHandler = event => {

    // I would rather use the keycode but it always came up 0
    // comparing a number would be faster
    if (event.key === 'Enter') {

      // add to array
      addInput(clockBalls)

      // clear input
      setClockBalls("")
    }

  }

  // add last input to the inputs array
  const addInput = (balls) => {

    if (Number(balls) === 0) {

        getResults()
    } 
    else {

      setInputs([...inputs,balls])

    }
    

  }

  // function to remove an input
  const removeInput = (index) => {

    console.log ("removing", index)

    // can't hange inputs directly
    let newInputs = [...inputs]
    newInputs.splice(index,1)
    setInputs(newInputs)

  }

  // function to reset page
  const reset = () => {
    setInputs([])
    setResults([])
    setClockBalls("")
  }

  // get result and add it to result array
  const getResults = () => {

    for (let input of inputs) {

      try {
        let result = findCompleteCycle(input)
        let days = result / (24 * 60)
        setResults([...results,`${input} balls cycles in ${days} days`])
      }
      catch(error) {
        setResults([...results,error.message])
      }

    } // for inputs

  }

  // render component
  return (

    <div>
        <h1>Ball Clock</h1>
        <h3>Enter a series of ball amounts.</h3>
        <h3>Enter 0 to end input and run</h3>
        <label>enter a number between 27 and 127</label>
        <br></br>
        <input type="text"  onChange={event => setClockBalls(event.target.value)} onKeyPress={clockBallsOnKeyPressHandler} value={clockBalls}></input>
        <br></br>
        <button onClick={reset}>Reset</button>
        <br></br>
        <p>Inputs</p>
        {
          // show inputs
          inputs.map((item,index) => {
            return <Input index={index} key={index} item={item} removeInput={removeInput}></Input> 
          })
        }

        {
          // show results
          results.map((item,index) => {
            return <p key={index}>{item}</p>
          })
        }

    </div>

  );
}
