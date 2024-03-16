/* eslint-disable react/prop-types */
import { SwitchUserModalItem } from './SwitchUserModalItem';

export function SwitchUserModal({users, currentUser, onDoneSwitchUser}) {    

    return (!users ? '' :
        <section className="center-container">
            <div className="switch-user">
                <div className="switch-user-title">
                    <span>Switch accounts</span>
                </div>
                <div className="switch-user-list">
                    {[currentUser, ...users.filter(user=>user._id !== currentUser._id)].map(user => 
                        <SwitchUserModalItem key={user._id} user={user} currentUser={currentUser} onDoneSwitchUser={onDoneSwitchUser}/>)}
                </div>
                <div className="switch-user-footer">
                    <span>Log into an Existing Account</span>
                </div>
            </div>
        </section> 
    )
}
