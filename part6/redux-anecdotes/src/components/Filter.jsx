import { filterChange } from '../reducers/filterReducer'
import { useDispatch } from 'react-redux'

const Filter = () => {
  const dispatch = useDispatch()
  const handleSearchChange = (event) => {
    dispatch(filterChange(event.target.value))
  }


  return (
    <div>
      <div>
        filter < input 
        type ='text' 
        name = 'filter'
        onChange = {handleSearchChange}
        />
    </div>
    </div>
  )
}

export default Filter