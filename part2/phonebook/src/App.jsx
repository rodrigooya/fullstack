import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonsForm from './components/PersonsForm'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [addMessage, setAddMessage] = useState(null)
  const [value, setValue] = useState(true)

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
      <Notification message={addMessage} value={value}/>
      <Filter key={persons.id} persons={persons} setPersons={setPersons} />
      <h2>add a new</h2>
      <PersonsForm key={persons.id} persons={persons} setPersons={setPersons} setValue={setValue} setAddMessage={setAddMessage}  />
      <h2>Numbers</h2>
      <ul>
        {persons.map(persons => 
          <Persons key={persons.id} persons={persons} setPersons={setPersons} />
        )}
      </ul>
    </div>
  )
}

export default App