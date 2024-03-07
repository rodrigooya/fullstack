import { useState, useEffect } from 'react'
import axios from 'axios'

const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>;

const App = () => {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState ('')
  const [isShown, setIsShown] = useState(false);


  useEffect(() => {    
    axios      
    .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)      
    .then(response => {        
      setCountries(response.data)      
    }) 
    
  }, [])
  
  if (!countries) {     
    return null   
  }

  


  const handleShowClick = event => {
    console.log("Button  clicked ...", event);
    setIsShown(current => !current);
  }
  
  const Countries = (props) => {
    console.log("veamos", props.country)
    return (
      <li key={props.country.name.common}>{props.country.name.common}
          <button onClick={handleShowClick} >show</button>
          {isShown && (
          <div >
            <Country key={countries} country={props.country}/>
          </div>
          )}
         
        </li>
    )
  }

  const Country = (props) => {
    
    return (
      <div>
        <div key={props.country}>
          <h1 key={props.country.name.common}>{props.country.name.common}</h1>
          <p key={props.country.capital}> capital {props.country.capital}</p>
          <p key={props.country.population}> populaton {props.country.population}</p>
          <p key={props.country.flag}>{props.country.flag}</p>
        </div>
      </div>
    )
  }
  
  const FilterCountry = () => {
    
    if (countries.length >= 10) {
      return (
        <div>
          <p>Too many matches, specify another filter</p>
        </div>
      )
    }
    if (countries.length <= 9 && countries.length>1) {
      
      return (
        <ul>
          {countries.map(countries =>
          
          <Countries key={countries} country={countries}/>
          
        )}
        
        </ul>
      )
    }
    else{
      return (
        <div>
          {countries.map(countries =>
              <Country key={countries} country={countries}/>
          )}
        </div>
          
      )
    }
  
  }

  const handleSearchChange = (event) => {
    
    setSearch(event.target.value)
    setCountries(countries.filter(countries =>
      countries.name.common.toUpperCase( ).includes(search.toUpperCase( )  
    )) 
    )
    
  }
  
  return (
    <div>
      <div>
      find countries< input type ='text' value = {search} onChange = {handleSearchChange}/>
      <FilterCountry key={countries.id} countries={countries} />
      </div>
      
    </div>
  )
}

export default App