/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router';
import { SVG_SwitchUserCheckbox } from '../services/svg.service';
import { userActions } from '../store/actions/user.actions'

export function SwitchUserModalItem({user, currentUser, onDoneSwitchUser}) {

    const navigate = useNavigate()

    async function onSwitchUser(event) {
        try {
            //await userActions.logout()
            await userActions.login({"username": user.username, "password": "1234"}, navigate)
            setTimeout(()=>{navigate(0),500})        
            onDoneSwitchUser()
        }
        catch(err) {
            onDoneSwitchUser()
        }
    }

    const { _id, username, imgUrl } = user
    return (
        <section className="switch-user-item" onClick={onSwitchUser}>
            <div className="user-details">
                <img src={imgUrl}></img>
                <span>{username}</span>
            </div>
            {_id === currentUser._id &&
                <div className="switch-user-checkbox">
                    <div className="checkbox-svg">
                        <SVG_SwitchUserCheckbox/>
                    </div>
                </div>}
        </section> 
    )     
}
