import { Avatar } from "@mui/material";
import { imagePath } from "../../utils/profileImage";

/**
 * Shows the profile avatar image
 */
const ProfileAvatar = (props) => {
    const { username, image } = props;
    return (
        image ? 
            <Avatar alt={username} src={imagePath+image} sx={props.styles}/>
        : <Avatar alt={username} sx={props.styles}>{username.substring(0, 2)}</Avatar>
    )
}
export default ProfileAvatar;