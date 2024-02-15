/* eslint-disable react/prop-types */

export function UserDetailsContent({images}) {

    return (
        images.map(story => 
            <img src={story.imgUrl} className='user-content-image' key={story.imgUrl}></img>
        )
    )     
}
