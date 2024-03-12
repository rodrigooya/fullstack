import personService from '../services/persons'

const Persons = ({ persons, setPersons }) => {
  const Button = ({ onClick, text }) => (
    <button onClick={onClick}>
      {text}
    </button>
  )
  const handleDeleteClick = () => {
   
    if (window.confirm(`Delete ${persons.name} ?`)){
      window.open("exit.html", "Thanks for Visiting!");
      personService      
      .deleteData(persons.id)      
      .then(returnedPerson => {    
        setPersons(persons.map(person => person.id !== persons.id ? person : returnedPerson))
      })
    }
  }

  return (
    <li>
      {persons.name} 
      {persons.number} 
      <Button onClick={handleDeleteClick} text='delete' />
    </li>
  )
}

export default Persons