import { Grid, Typography, TextField, Avatar, Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import ImagePicker from './ImagePicker';
import SelectRange from '../Navbar/SelectRange';
import { isNull } from 'lodash';
import { MidiNumbers } from 'react-piano';

/**
 * Parses the range to avoid null values
 * @param {*} min vocal range
 * @param {*} max vocal range 
 * @returns default range if any is null
 */
const parseRange = (min, max) => {
    if (!isNull(min) && !isNull(max)) return [min, max];
    return [48, 60];
}

/**
 * Gets the ntoe name from a midinumber
 * @param {*} number midinumber of the note
 * @returns note name with octave
 */
const numberToNote = (num) => MidiNumbers.getAttributes(num).note;

/**
 * Shows a user profile
 */
const Profile = ({ profileData, username, isOwner, update }) => {
    const [isHovered, setIsHovered] = useState(false);
    /**
     * Toggles the hovered status
     */
    const toggleHover = () => {
        setIsHovered(!isHovered);
    }
    const [editMode, setEditMode] = useState(false);
    const { vocalRangeMax, vocalRangeMin } = profileData;
    const [range, setRange] = useState(parseRange(vocalRangeMin, vocalRangeMax));
    const [editedProfileData, setEditedProfileData] = useState({...profileData});

    /**
     * Changes the selected image
     * @param {*} image selected image
     */
    const changeImage = (image) => {
        setEditedProfileData(Object.assign({...editedProfileData}, { image }));
        setEditMode(false);
    }

    /**
     * Changes the biography
     * @param {*} event 
     */
    const changeBiography = (event) => {
        const biography = event.target.value;
        setEditedProfileData(Object.assign({...editedProfileData}, { biography }));
    }

    useEffect(() => {
        setEditedProfileData(Object.assign({...editedProfileData}, { vocalRangeMin: range[0], vocalRangeMax: range[1] }))
    }, [range])

    /**
     * Updates the profile on submit
     */
    const onSubmit = () => {
        update(editedProfileData);
    }

    return (
        <Grid container
            spacing={2}
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <Grid item
                xs={12}
            >
                <div onMouseEnter={toggleHover} onMouseLeave={toggleHover}>
                    {isOwner && isHovered &&
                        <Avatar sx={{ width: 200, height: 200 }} onClick={() => setEditMode(true)}>
                            <ModeEditIcon />
                        </Avatar>
                    }
                    {((isOwner && !isHovered) || !isOwner) &&
                        <ProfileAvatar
                            username={username}
                            image={editedProfileData.image}
                            styles={{ width: 200, height: 200 }}
                        />

                    }
                </div>
                {editMode &&
                    <ImagePicker changeImage={changeImage} />
                }
                <Typography variant="h2">{username}</Typography>
                {isOwner ?
                    <TextField
                        id="biography"
                        label="Biography"
                        multiline
                        minRows={4}
                        fullWidth
                        inputProps={{ maxLength: 300 }}
                        defaultValue={isNull(editedProfileData.biography) ? '' : editedProfileData.biography}
                        onChange={changeBiography}
                    /> :
                    <>
                        <Typography variant="h5">Biography:</Typography>
                        <Typography variant="p">{profileData.biography}</Typography>
                    </>
                }

                <Typography variant="h5">Stats:</Typography>
                {isOwner &&
                    <SelectRange setRange={setRange} withMarks={false} range={range} minSep={1} />
                }
                <Stack>
                    <Typography variant="p">Lowest note: {numberToNote(range[0])}</Typography>
                    <Typography variant="p">Highest note: {numberToNote(range[1])}</Typography>
                </Stack>
                {isOwner &&
                    <Button onClick={onSubmit}>Update profile</Button>
                }
            </Grid>
        </Grid >
    )
}

export default Profile;