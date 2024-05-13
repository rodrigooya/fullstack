/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

// eslint-disable-next-line react/prop-types
const Anecdote = ({ anecdote, handleClick }) => {
    return(
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const Anecdotes = () => { 
    const anecdotes = useSelector(({ filter, anecdotes }) => {
        if ( filter === 'ALL' ) {
          return anecdotes
        }
        return(
            anecdotes.filter(anecdotes =>
                anecdotes.content.toUpperCase( ).includes(filter.toUpperCase( )  
            )) 
        )   
    })
    
    const dispatch = useDispatch()
  
    const byVotes = (a, b) => b.votes - a.votes

  return(
    <div>
        {[...anecdotes].sort(byVotes).map(anecdote =>
            <Anecdote
                key={anecdote.id}
                anecdote={anecdote}
                handleClick={() =>(
                    dispatch(updateAnecdote(anecdote.id)),
                    dispatch(setNotification(`You voted '${anecdote.content}' `, 5000))
                )                 
            }
            />
        )}
    </div>
  )
}

export default Anecdotes