import React, { useEffect } from 'react';
import { useContext, useState } from 'react';
import { FetchContext } from '../contexts/FetchContext';
import Profile from '../components/Profile/Profile';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../store/reducers/authReducer';
import { updateProfile } from '../store/reducers/profileReducer';

/**
 * Profile page
 */
const ProfilePage = (props) => {
    const dispatch = useDispatch();
    const fetchContext = useContext(FetchContext);
    const [userData, setUserData] = useState();
    const [profileData, setProfileData] = useState();
    const { userId } = useParams();
    const ownerData = useSelector(selectUser);
    const isOwner = ownerData.userId === userId;

    useEffect(() => {
        const getProfile = async () => {
            try {
                const { data } = await fetchContext.authAxios.get(
                    `profiles/${userId}`
                );
                setProfileData(data);
            } catch(err) {

            }
        }
        const getUserData = async () => {
            try {
                const { data } = await fetchContext.authAxios.get(
                    `users/${userId}`
                );
                const { username } = data;
                setUserData(username);
            } catch(err) {

            }
        }
        getProfile();
        getUserData();
    }, [fetchContext, userId])

    /**
     * Updates the profile
     * @param {*} profile 
     */
    const update = async (profile) => {
        try {
            dispatch(updateProfile({profile, userId}));
        } catch(err) {

        }
    }

    return (
        <>
            {userData && 
            profileData && 
            <Profile 
                profileData={profileData} 
                username={userData} 
                isOwner={isOwner}
                update={update}
            />}
        </>
    )
}

export default ProfilePage;