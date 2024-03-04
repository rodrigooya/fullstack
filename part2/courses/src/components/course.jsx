const Header = (props) => {
    return (
      <div>
        <h1>
          {props.course}
        </h1>
      </div>
    )
  }
  
  const Part= (props) => {
    return (
      <div>
          <p>{props.name} {props.exercises}</p>
      </div>
    )
  }
  
  const Content= (props) => {
    return (  
      <div>
        {props.parts.map(part =>           
        <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
      </div>
    )
  }
  
  const Total= (props) => {
     
   
    return (
      <div>
          <p>Number of exercises {props.parts.reduce((a,b) => a + b.exercises, 0)} </p>
          
      </div>
    )
  }
  const Course = props => {
    
   
  return(
  <div>
        <Header course={props.course.name} />
        <Content parts={props.course.parts} />
        <Total parts={props.course.parts} />
      </div>
  )
  
  }

export default Course;