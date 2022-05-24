import { useEffect, useState } from 'react'
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Button,
    Tooltip,
    MenuItem,
    Divider
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ProfileAvatar from '../Profile/ProfileAvatar.jsx';
import { useSelector, useDispatch } from 'react-redux'
import { isLogged, logout, selectUser } from '../../store/reducers/authReducer';
import { fetchProfile, resetProfile, selectProfileData } from '../../store/reducers/profileReducer.js';
import { resetDashboard } from '../../store/reducers/dashboardReducer.js';

const pages = require('./routes').default;

/**
 * App navigation bar
 */
const ResponsiveAppBar = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUser);
    const isLoggedIn = useSelector(isLogged);
    const profileStatus = useSelector(state => state.user.profile.status);
    const profileData = useSelector(selectProfileData);

    /**
     * If the user is logged in and the profile has not been fetched, calls the api
     */
    useEffect(() => {
        if (isLoggedIn && profileStatus === 'idle') {
            dispatch(fetchProfile(userData.userId));
        }
    }, [isLoggedIn, profileStatus, userData, dispatch])

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    /**
     * Handles the opening of the nav menu
     * @param {*} event 
     */
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    /**
     * Handles the opening of the user menu
     * @param {*} event 
     */
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    /**
     * Handles the closure of the nav menu
     * @param {*} event 
     */
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };
    /**
     * Handles the closure of the user menu
     * @param {*} event 
     */
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    /**
     * Logs the user out
     * @param {*} event 
     */
    const logOut = () => {
        handleCloseUserMenu();
        dispatch(logout());
        dispatch(resetProfile());
        dispatch(resetDashboard());
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                    >
                        <img src="/logo.png" alt="Vocal Trainer Logo" height={100} width={150}></img>
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <Link key={page.name} to={page.route}>
                                    <MenuItem onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}

                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link to={page.route} key={page.name}>
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            </Link>
                        ))}
                    </Box>
                    {!isLoggedIn &&
                        <Box sx={{
                            display: "flex",
                            alginItems: "center",
                            flexGrow: 0
                        }}>
                            <Link to="login">
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Log In
                                </Button>
                            </Link>
                            <Divider orientation="vertical" flexItem />
                            <Link to="signup">
                                <Button
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    Sign Up
                                </Button>
                            </Link>
                        </Box>
                    }
                    {isLoggedIn &&
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, gap: 1 }}>
                                    <ProfileAvatar
                                        username={userData.username}
                                        image={profileData.image}
                                    />
                                    <Typography textAlign="center" sx={{ color: 'white' }}>{userData.username}</Typography>
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to={`/profile/${userData.userId}`}>
                                        <Typography textAlign="center">Profile</Typography>
                                    </Link>
                                </MenuItem>
                                <MenuItem onClick={logOut}>
                                    <Typography textAlign="center">Log out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default ResponsiveAppBar;