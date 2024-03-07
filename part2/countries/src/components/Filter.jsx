

const Filter = ({ countries }) => {
 
  
  return( 
    <div>
        find countries
        <ul>
          {countries.map(countries =>
            <li>{countries.name.common}</li>
        )}
        </ul>
    </div>

  )
}

export default Filter