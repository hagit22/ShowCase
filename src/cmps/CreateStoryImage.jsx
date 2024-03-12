/* eslint-disable react/prop-types */
import { useRef } from 'react'
import { uploadImage } from '../services/upload.service'
import { onToggleModal } from '../store/actions/app.actions'
import { CreateStoryText } from './CreateStoryText';
import { SVG_CreateNewPost } from '../services/svg.service.jsx';

export function CreateStoryImage({onAddStory}) {

    const hiddenFileInput = useRef(null);

    const onSelectImage = async (event) => {
        try {
            const { secure_url : imageUrl } = await uploadImage(event)
            onToggleModal({ cmp: CreateStoryText, props: {imageUrl, onAddStory} })
        }
        catch(error) {
            console.log("CreateStoryImage: ",error)
        }
    }

    const onClickSelect = async (event) => {
        hiddenFileInput.current.click()
    }

    return (
        <section className="modal-container">
            <div className="create-story-image">
                <div className="create-new-post">

                    <div className="title">
                        Create new post
                    </div>

                    <div className="content">
                        <SVG_CreateNewPost/>
                        <div>
                            <span>Drag photos and videos here</span>
                        </div>
                        <button onClick={onClickSelect} >Select from computer</button>
                        <input ref={hiddenFileInput} type="file" onChange={onSelectImage} accept="img/*" style={{display:'none'}}/>
                        {/*<button onClick={onSelectImage}>Select from computer</button>*/}
                    </div>

                </div>
            </div>
        </section>
    )
}
