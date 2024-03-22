//import { useDispatch, useSelector } from "react-redux"
//import { SET_MODAL_DATA } from "../store/reducers/app.reducer"
import { useEffect, useRef } from "react"
import { SVG_CloseModal } from "../services/svg.service.jsx"

export function DynamicModal2({cmp, modalProps, onCloseModal}) {
    //const modalData = useSelector(storeState => storeState.appModule.modalData)
    //const dispatch = useDispatch()
    
    const modalRef = useRef()

    useEffect(() => {
        if (cmp) { // modalData
            setTimeout(() => {  // we set timeout (even 0), otherwise modal will close, when its first opened). 
                                // only after that, we set the event listener.
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [cmp]) // modalData

    /*function onCloseModal() {
        dispatch({ type: SET_MODAL_DATA, modalData: null })
    }*/

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) 
            onCloseModal()
    }

    if (!cmp) return <></>
    //const Cmp = modalData?.cmp
    const Cmp = cmp


    return (
        <div ref={modalRef} className="dynamic-modal">
            <button className="close" onClick={onCloseModal}>
                {/*X*/}
                <SVG_CloseModal>
                    <title>Close</title>
                    <polyline 
                        fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                    </polyline>
                    <line 
                        fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354">
                    </line>
                </SVG_CloseModal>
            </button>
            <section>
                {Cmp && <Cmp className="content" {...modalProps} />}
            </section>
        </div>
    )
}

