import React, { useContext, useEffect, useState } from 'react'
import {
    Card, CardContent,
    Typography
} from '@mui/material';
import { FetchContext } from '../../contexts/FetchContext';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../Profile/ProfileAvatar';

/**
 * Displays an profile as a card
 */
const ProfileCard = ({data: { username, userId }}) => {
    const fetchContext = useContext(FetchContext);
    const [image, setImage] = useState();

    /**
     * Fetches the image for the profile card
     */
    useEffect(() => {
        const getImage = async () => {
            try {
                const { data } = await fetchContext.authAxios.get(
                    `profiles/${userId}`
                )
                setImage(data.image);
            } catch {

            }
        }
        getImage();
    }, [fetchContext, userId])

    return (
        <>
            <Card sx={{ minWidth: "fit-content" }}>
                <Link to={`/profile/${userId}`}>
                    <CardContent>
                    <ProfileAvatar
                            username={username}
                            image={image}
                        />
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Username: {username}
                        </Typography>
                    </CardContent>
                </Link>
            </Card>
        </>
    )
}

export default ProfileCard;