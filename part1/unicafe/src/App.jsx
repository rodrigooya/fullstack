import { useState } from 'react'

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const StatisticsLine = ({value, text}) => {
  return(
    <tr>
      <td>{text}</td> 
      <td>{value}</td>
    </tr>     
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
            <StatisticsLine text="good" value={props.clicks.good}/>
            <StatisticsLine text="neutral" value={props.clicks.neutral}/>       
            <StatisticsLine text="bad" value={props.clicks.bad}/>
            <StatisticsLine text="all" value={props.allClicks.length}/>
            <StatisticsLine text="average" value={props.allClicks.reduce((a, b) => a + b, 0)/(props.allClicks.length)}/>
            <StatisticsLine text="positive" value={`${((props.clicks.good)/(props.allClicks.length))*100} %`} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad:0
  })
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () => {
    setAll(allClicks.concat(1))
    setClicks({ ...clicks, good: clicks.good + 1 })
  }

  const handleNeutralClick = () => {
    setAll(allClicks.concat(0))
    setClicks({ ...clicks, neutral: clicks.neutral + 1 })
  }

  const handleBadClick = () => {
    setAll(allClicks.concat(-1))
    setClicks({ ...clicks, bad: clicks.bad + 1 })
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text='good' />
      <Button onClick={handleNeutralClick} text='neutral' />
      <Button onClick={handleBadClick} text='bad' />   
      <Statistics allClicks={allClicks} clicks={clicks}/>
    </div>
  )
}

export default App