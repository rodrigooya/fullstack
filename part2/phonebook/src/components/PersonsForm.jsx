import { useState } from 'react'
import personService from '../services/persons'

const PersonsForm = ({persons, setPersons}) => {
  
    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    
    const addPersons = (event) => {    
        event.preventDefault()       
        const personsObject = {
            name: newName,
            number: newNumber,
        } 
        const filter = persons.filter(person => {
            return person.name === newName; 
        });

        if (filter.length ==! 0){
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with new one?`)){
              window.open("exit.html", "Thanks for Visiting!");
          personService      
              .update(filter[0].id, personsObject)      
              .then(returnedPerson => {    
                setPersons(persons.map(person => person.id !== persons.id ? person : returnedPerson))
                setNewName('')
                setNewNumber('')
              })
          }
        }else{
          personService      
          .create(personsObject)      
          .then(returnedPerson => {        
            setPersons(persons.concat(returnedPerson))     
            setNewName('')
            setNewNumber('')
          })
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
