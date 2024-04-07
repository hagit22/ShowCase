/* eslint-disable react/prop-types */
import { useState, useRef } from 'react'
import { uploadImage } from '../services/upload.service'
import { onToggleModal } from '../store/actions/app.actions'
import { CreateStoryText } from './CreateStoryText';
import { SVG_CreateNewPost } from '../services/svg.service.jsx';
import CircularProgress from '@mui/material/CircularProgress'

export function CreateStoryImage({onAddStory}) {

    const hiddenFileInput = useRef(null);
    const selectButton = useRef(null)
    const [isLoading, setIsLoading] = useState(false)

    const onSelectImage = async (event) => {
        try {
            setIsLoading(true)
            selectButton.current.style.backgroundColor = "lightgray" //variables.lightText
            selectButton.current.style.cursor = "default"
            selectButton.current = null

            const { secure_url : imageUrl } = await uploadImage(event)
            setIsLoading(false)
            onToggleModal({ cmp: CreateStoryText, props: {imageUrl, onAddStory} })
        }
        catch(error) {
            console.log("CreateStoryImage: ",error)
        }
    }

    const onClickSelect = async (event) => {
        hiddenFileInput.current.click()
        /*selectButton.current.style.backgroundColor = "lightgray" //variables.lightText
        selectButton.current.style.cursor = "default"
        selectButton.current = null*/
    }

    return (
        <section className="center-container">
            <div className="create-story-image">
                <div className="create-story-image-title">
                    Create new post
                </div>
                <div className="create-story-image-content">
                    <SVG_CreateNewPost/>
                    <div className="content-caption">
                        <span>Drag photos and videos here</span>
                    </div>
                    <div className="content-button">
                        <button ref={selectButton} onClick={onClickSelect} >Select from computer</button>
                        <input ref={hiddenFileInput} type="file" onChange={onSelectImage} accept="img/*" style={{display:'none'}}/>
                        {/*<button onClick={onSelectImage}>Select from computer</button>*/}
                    </div>
                    <div  className={`progress-animation ${isLoading ? ' progress-show' : ' progress-hide'}`}>
                        <CircularProgress/>
                    </div>
                </div>
            </div>
        </section>
    )
}
