import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const style = {
    backgroundColor: 'lightgrey',
    margin: '10px',
    padding: '10px',
    border: '2px solid',
    borderRadius: '5px',
  }
  const notification = useNotificationValue()

  if (!notification) return null

  return <div style={style}>{notification}</div>
}

export default Notification
