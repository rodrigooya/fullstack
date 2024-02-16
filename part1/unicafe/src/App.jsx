import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticsLine = (props) => {
  return(    
    <td>{props.value}</td>
  )
}
const Statistics = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <tr>
            <td>good</td>
            <StatisticsLine text="good" value={props.good}/>
          </tr>
          <tr>
            <td>neutral</td>
            <StatisticsLine text="neutral" value={props.neutral}/>
          </tr>
          <tr>
            <td>bad</td>
            <StatisticsLine text="bad" value={props.bad}/>
          </tr>
          <tr>
            <td>all</td>
            <td>{props.allClicks.length}</td>
          </tr>
          <tr>
            <td>average</td>
            <td>{props.allClicks.reduce((a, b) => a + b, 0)/(props.allClicks.length)}</td>
          </tr>
          <tr>  
            <td>positive</td>
            <td>{((props.good)/(props.allClicks.length))*100} %</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setAll(allClicks.concat(1))
    setGood(good + 1)
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat(0))
    setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
    setAll(allClicks.concat(-1))
    setBad(bad + 1)
  }

  return (
    <div>
      <h1>give feedback</h1>
     

      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />   
      <Statistics allClicks={allClicks} good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App