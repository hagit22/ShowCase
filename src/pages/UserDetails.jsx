import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { storyActions } from '../store/actions/story.actions'
import { userActions } from '../store/actions/user.actions'
import { ProfileContentTab } from '../cmps/ProfileContentTab'
import { UserDetailsContent } from '../cmps/UserDetailsContent'
import { InstagramError } from '../cmps/InstagramError'
import { SVG_ProfileTabPosts, SVG_ProfileTabSaved, SVG_ProfileTabTagged } from '../services/svg.service'
import { SVG_ProfileTabPostsFull, SVG_ProfileTabSavedFull, SVG_ProfileTabTaggedFull } from '../services/svg.service'

export function UserDetails() {

  const params = useParams()
  const stories = useSelector(storeState => storeState.storyModule.stories)
  const user = useSelector(storeState => storeState.userModule.chosenUser)

  const [contentImages, setContentImages] = useState([])
  const [currentTab, setCurrentTab] = useState("posts")
  const [numPosts, setNumPosts] = useState()
  
  useEffect(() => {
    userActions.loadChosenUser(params.username)
    storyActions.loadStories()
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
    <section>
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
          <span><span>{numPosts}</span> {numPosts == 1 ? "post" : "posts"}</span>
          <span><span>{user.followers.length}</span> {user.followers.length == 1 ? "follower" : "followers"}</span>
          <span><span>{user.following.length}</span> following</span>
          {/*<div class="break"></div>*/}
          <span className={`fullname ${!user.fullname ? ' keep-height' : ''}`}>{user.fullname || 'empty'}</span>
          <hr className='user-header-hr'/>
          <ProfileContentTab id="posts" text="POSTS" IconEmpty={SVG_ProfileTabPosts} IconFull={SVG_ProfileTabPostsFull} 
              selected={currentTab} onClickTab={onClickTab} />
          <ProfileContentTab id="saved" text="SAVED" IconEmpty={SVG_ProfileTabSaved} IconFull={SVG_ProfileTabSavedFull} 
              selected={currentTab} onClickTab={onClickTab} />
          <ProfileContentTab id="tagged" text="TAGGED" IconEmpty={SVG_ProfileTabTagged} IconFull={SVG_ProfileTabTaggedFull} 
              selected={currentTab} onClickTab={onClickTab} />
        </div>
      </div>
      <div className='user-details-content'>
          <UserDetailsContent userStories={contentImages} />
      </div>
    </section>
  )
}