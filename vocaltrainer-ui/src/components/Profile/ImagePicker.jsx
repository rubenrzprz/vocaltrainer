import { Avatar, Grid, Tooltip } from '@mui/material';
import { imageList, imagePath } from '../../utils/profileImage';

/**
 * Allows to choose an image from a list
 */
const ImagePicker = (props) => {
    /**
     * Changes the selected image
     * @param {*} image selected image
     */
    const changeImage = (image) => {
        props.changeImage(image);
    }
    return (
        <Grid container

        >
            {imageList.map(pic => (
                <Grid item key={pic.image}>
                    <Tooltip title={pic.desc}>
                        <Avatar src={imagePath + pic.image} onClick={() => changeImage(pic.image)} />
                    </Tooltip>
                </Grid>
            ))}
        </Grid>
    )
}
export default ImagePicker;