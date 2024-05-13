const Notification = ({ message, value }) => {

  if (message === null) {
    return null
  }
  return (
    <div className={value? 'error':'add'}>
      {message}
    </div>
  )
}

export default Notification