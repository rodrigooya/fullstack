import {useState} from 'react'

const Filter = ({ persons, setPersons }) => {
    const [search, setSearch] = useState (''); 

    const handleSearchChange = (event) => {
      setSearch(event.target.value)
      setPersons(persons.filter(persons =>
        persons.name.toUpperCase( ).includes(search.toUpperCase( )  
      )) 
      )
    }

  return( 
    <div>
        filter shown with< input type ='text' value = {search} onChange = {handleSearchChange}/>
    </div>
  )
}

export default Filter