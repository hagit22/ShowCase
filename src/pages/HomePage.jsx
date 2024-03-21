import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userActionTypes } from '../store/reducers/user.reducer'


export function HomePage() {
    const dispatch = useDispatch()
    const count = useSelector(storeState => storeState.userModule.count)

    function changeCount(diff) {
        console.log('Changing count by:', diff);
        dispatch({ type: userActionTypes.CHANGE_COUNT, diff })
    }

    return (
        <section>
            <h2>
                Count {count}
                <button onClick={() => {
                    changeCount(1)
                }}>+</button>
                <button onClick={() => {
                    changeCount(10)
                }}>+10</button>
            </h2 >
            <img src={'img/instushram-logo.jpg'} style={{width: '100px'}} />
        </section >
    )
}