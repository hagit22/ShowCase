import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { loadUser } from '../store/actions/user.actions'
import { store } from '../store/store'
import { showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from '../services/socket.service'
import { UserDetailsContent } from '../cmps/UserDetailsContent'
import { InstagramError } from '../cmps/InstagramError'

export function UserDetails({stories}) {

  const params = useParams()
  const user = useSelector(storeState => storeState.userModule.watchedUser)

  const [contentImages, setContentImages] = useState([])
  const [currentTab, setCurrentTab] = useState("posts")
  

  useEffect(() => {
    loadUser(params.username)
    socketService.emit(SOCKET_EMIT_USER_WATCH, params.username)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    return () => {
      socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    }
  }, [params.username])

  function onUserUpdate(user) {
    showSuccessMsg(`This user ${user.username} just got updated from socket`)
    store.dispatch({ type: 'SET_WATCHED_USER', user })
  }

  function onClickTab({target}) {
    setCurrentTab(target.id)
  }


  return ( !user ? <InstagramError/> :
    <section className="user-details">
      <div className='user-details-header'>
        <img src={user.imgUrl}></img>
        <div className='user-header-actions'>
          <span> {user.username} </span>
          <div className='action-buttons'>
            <button>Edit profile</button>
            <button>View archive</button>
          </div>
        </div>
        <hr className='user-header-hr'/>
        <div className='user-header-info'>
          <span>post(s)</span>
          <span>followers</span>
          <span className="following">following</span>
          <span> {user.fullname}</span>
          <hr className='user-header-hr'/>
          <span className={`info-tabs ${currentTab=="posts" ? "chosen-tab" : ''}`} onClick={onClickTab} id="posts">POSTS</span>
          <span className={`info-tabs ${currentTab=="saved" ? "chosen-tab" : ''}`} onClick={onClickTab} id="saved">SAVED</span>
          <span className={`info-tabs ${currentTab=="tagged" ? "chosen-tab" : ''}`} onClick={onClickTab} id="tagged">TAGGED</span>
        </div>
      </div>
      <div className='user-details-content'>
        {/*<img src={user.imgUrl} className='user-content-image'></img>*/}
          <UserDetailsContent images={stories.filter(story => story.by._id == user._id)}/>
      </div>
    </section>
  )


  /*return (
    <section className="user-details">
      <h1>User Details</h1>
      {user && 
        <div>
          <h3>{user.username}</h3>
          <img src={user.imgUrl} style={{ width: '100px' }} />
          <pre> {JSON.stringify(user, null, 2)} </pre>
        </div>}
    </section>
  )*/
}