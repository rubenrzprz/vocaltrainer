require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwtDecode = require('jwt-decode')

const app = express();

var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({message: 'welcome to my app'});
});

require('./app/routes/authentication.routers')(app);

/**
 * Attaches a user to the requests if the authentication is successfull
 */
const attachUser = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token) {
        return res.status(401).json({
            message: 'Authentication invalid'
        })
    }
    const decodedToken = jwtDecode(token.slice(7));

    if(!decodedToken) {
        return res.status(401).json({
            message: 'There was a problem authorizing the request'
        })
    }
    req.user = decodedToken;
    next();
}

app.use(attachUser);

require('./app/routes/user.routers')(app);
require('./app/routes/profile.routers')(app);
require('./app/routes/publication.routers')(app);
require('./app/routes/comment.routers')(app);
require('./app/routes/exerciseList.routers')(app);
require('./app/routes/melodyFragment.routers')(app);
require('./app/routes/breathingFragment.routers')(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})