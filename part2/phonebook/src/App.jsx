import { useState } from 'react'
import Persons from './components/Persons'
import PersonsForm from './components/PersonsForm'
import Filter from './components/Filter'
const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  

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