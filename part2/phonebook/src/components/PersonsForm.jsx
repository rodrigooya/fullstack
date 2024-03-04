import { useState } from 'react'

const PersonsForm = ({persons, setPersons}) => {
  
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    
    const addPersons = (event) => {    
        event.preventDefault()       
        const personsObject = {
            name: newName,
            number: newNumber,
            id: persons.length + 1,
        } 
        const filter = persons.filter(person => {
            return person.name === newName; 
        });

        if (filter.length ==! 0){
            (window.confirm(`${newName} is already added to phonebook`))  
        }else{
        setPersons(persons.concat(personsObject))
        setNewName('')
        setNewNumber('')
    }}
  
    const handleNameChange = (event) => {    
        setNewName(event.target.value)
    }
    
    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

  return (
    <div>
      
      <form onSubmit={addPersons} >
          <div>
            name: <input value={newName} onChange={handleNameChange}/>
          </div>
          <div>
            number: <input value={newNumber} onChange={handleNumberChange}/></div>
          <div>
            <button type="submit">add</button>
          </div>
      </form>
    </div>
  )
}

export default PersonsForm
