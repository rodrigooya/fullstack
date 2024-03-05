import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonsForm from './components/PersonsForm'
import Filter from './components/Filter'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  useEffect(() => {   
    personService      
    .getAll()      
    .then(initialPersons => {        
      setPersons(initialPersons)
    })
  }, [])  

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter key={persons.id} persons={persons} setPersons={setPersons} />
      <PersonsForm persons={persons} setPersons={setPersons}/>
      <h2>Numbers</h2>
      <ul>
        {persons.map(persons => 
          <Persons key={persons.id} persons={persons} />
        )}
      </ul>
    </div>
  )
}

export default App