import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { storyActions } from '../store/actions/story.actions'
import { userActions } from '../store/actions/user.actions'
import { UserDetailsTab } from '../cmps/UserDetailsTab'
import { UserDetailsContent } from '../cmps/UserDetailsContent'
import { InstagramError } from '../cmps/InstagramError'
import { SVG_ProfileTabPosts, SVG_ProfileTabSaved, SVG_ProfileTabTagged, SVG_UserSettings } from '../services/svg.service'

export function UserDetails({currentUser}) {

  const params = useParams()
  const stories = useSelector(storeState => storeState.storyModule.stories)
  const user = useSelector(storeState => storeState.userModule.chosenUser)

  const [contentImages, setContentImages] = useState([])
  const [currentTab, setCurrentTab] = useState("posts")
  const [numPosts, setNumPosts] = useState()
  
  useEffect(() => {
    userActions.loadChosenUser(params.username)
    storyActions.loadStories(currentUser)
  }, [params.username])

  useEffect(() => {
    if (!user)
      return
    if (currentTab == "posts") {
      setContentImages(stories.filter(story => story.by._id == user._id))
    }
    else if (currentTab == "saved")
      setContentImages(user.bookmarkedStories || [])
}, [user, currentTab])

  useEffect(() => {
    setNumPosts(stories?.filter(story=>story.by._id===user?._id).length)
  }, [stories])


  const onClickTab = ({target}) => {
    setCurrentTab(target.id)
  }


  return ( !user ? <InstagramError/> :
    <section className="center-section" >
      <div className='user-details-header'>
        <img src={user.imgUrl}></img>
        <div className='user-header-actions'>
          <span className='username'> {user.username} </span>
          <div className='action-buttons'>
            <button>Edit profile</button>
            <button>View archive</button>
            <span className='settings'><SVG_UserSettings/></span>
          </div>
        </div>
        <hr className='user-header-hr'/>
        <div className='user-header-info'>
          <span><span>{numPosts}</span> {numPosts == 1 ? "post" : "posts"}</span>
          <span><span>{user.followers.length}</span> {user.followers.length == 1 ? "follower" : "followers"}</span>
          <span><span>{user.following.length}</span> following</span>
          {/*<div class="break"></div>*/}
          <span className={`fullname ${!user.fullname ? ' keep-height' : ''}`}>{user.fullname || 'empty'}</span>
          <hr className='user-header-hr'/>
          <UserDetailsTab id="posts" text="POSTS" Icon={SVG_ProfileTabPosts} selected={currentTab} onClickTab={onClickTab} />
          <UserDetailsTab id="saved" text="SAVED" Icon={SVG_ProfileTabSaved} selected={currentTab} onClickTab={onClickTab} />
          <UserDetailsTab id="tagged" text="TAGGED" Icon={SVG_ProfileTabTagged} selected={currentTab} onClickTab={onClickTab} />
        </div>
      </div>
      <div className='user-details-content'>
          <UserDetailsContent userStories={contentImages} />
      </div>
    </section>
  )
}