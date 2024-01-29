import { useDispatch, useSelector } from "react-redux"
import { SET_MODAL_DATA } from "../store/reducers/app.reducer"
import { useEffect, useRef } from "react"

export function DynamicModal() {
    const modalData = useSelector(storeState => storeState.appModule.modalData)
    const dispatch = useDispatch()
    const modalRef = useRef()

    useEffect(() => {
        if (modalData) {
            setTimeout(() => {
                document.addEventListener('click', handleClickOutside)
            }, 0)
        }
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [modalData])

    function onCloseModal() {
        dispatch({ type: SET_MODAL_DATA, modalData: null })
    }

    function handleClickOutside(ev) {
        if (modalRef.current && !modalRef.current.contains(ev.target)) {
            onCloseModal()
        }
    }

    if (!modalData) return <></>
    const Cmp = modalData?.cmp

    return (
        <div ref={modalRef} className="dynamic-modal">
            <button className="close" onClick={onCloseModal}>
                {/*X*/}
                <svg aria-label="Close" fill="currentColor" height="18" role="img" viewBox="0 0 24 24" width="18">
                    <title>Close</title>
                    <polyline 
                        fill="none" points="20.643 3.357 12 12 3.353 20.647" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3">
                    </polyline>
                    <line 
                        fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" x1="20.649" x2="3.354" y1="20.649" y2="3.354">
                    </line>
                </svg>
            </button>
            <section className="content">
                {Cmp && <Cmp {...modalData.props} />}
            </section>
        </div>
    )
}

