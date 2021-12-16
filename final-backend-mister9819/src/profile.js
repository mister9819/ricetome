const Profile = require('./schema/profileSchema');
const uploadImage = require('./uploadCloudinary')

module.exports = (app) => {
    app.get('/headline/:user?', getHeadline);
    app.put('/headline', updateHeadline);

    app.get('/following/:user?', getFollowing);
    app.put('/following/:user', updateFollowing);
    app.delete('/following/:user', deleteFollowing);

    app.get('/email/:user?', getEmail);
    app.put('/email', updateEmail);

    app.get('/zipcode/:user?', getZipcode);
    app.put('/zipcode', updateZipcode);

    app.get('/dob/:user?', getDob);

    app.get('/avatar/:user?', getAvatar);
    app.put('/avatar', uploadImage('avatar'), updateAvatar);
}

const getHeadline = (req, res) => {
    let username;
    if (req.params.user == null) {
        username = req.username;
    } else {
        username = req.params.user;
    }
    Profile.findOne({username: username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                res.send({"username": result.username, "headline": result.headline});
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const updateHeadline = (req, res) => {
    Profile.findOneAndUpdate({username: req.username}, {headline: req.body.headline})
        .then((result) => {
            res.send({"username": result.username, "headline": req.body.headline});
        })
        .catch((err) => {
            console.log(err);
        })
}

const getFollowing = (req, res) => {
    let username;
    if (req.params.user == null) {
        username = req.username;
    } else {
        username = req.params.user;
    }
    Profile.findOne({username: username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                res.send({"username": result.username, "following": result.following});
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const updateFollowing = (req, res) => {
    Profile.findOne({username: req.params.user})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Username does not exist.");
            } else {
                Profile.findOne({username: req.username})
                    .then((result) => {
                        if (result.following.includes(req.params.user)) {
                            res.status(400).send("Already following the username.")
                        } else if (req.username == req.params.user) {
                            res.status(400).send("Cannot follow yourself.")
                        } else {
                            result.following.push(req.params.user);
                            result.save()
                                .then((result) => {
                                    res.send({"username": result.username, "following": result.following});
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        })
        .catch((err) => {
            console.log(err);
        })

}

const deleteFollowing = (req, res) => {
    Profile.findOne({username: req.username})
        .then((result) => {
            result.following.pull(req.params.user);
            result.save()
                .then((result) => {
                    res.send({"username": result.username, "following": result.following});
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        })
}


const getEmail = (req, res) => {
    let username;
    if (req.params.user == null) {
        username = req.username;
    } else {
        username = req.params.user;
    }
    Profile.findOne({username: username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                res.send({"username": result.username, "email": result.email});
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const updateEmail = (req, res) => {
    Profile.findOneAndUpdate({username: req.username}, {email: req.body.email})
        .then((result) => {
            res.send({"username": result.username, "email": req.body.email});
        })
        .catch((err) => {
            console.log(err);
        })
}


const getZipcode = (req, res) => {
    let username;
    if (req.params.user == null) {
        username = req.username;
    } else {
        username = req.params.user;
    }
    Profile.findOne({username: username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                res.send({"username": result.username, "zipcode": result.zipcode});
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const updateZipcode = (req, res) => {
    Profile.findOneAndUpdate({username: req.username}, {zipcode: req.body.zipcode})
        .then((result) => {
            res.send({"username": result.username, "zipcode": req.body.zipcode});
        })
        .catch((err) => {
            console.log(err);
        })
}

const getDob = (req, res) => {
    let username;
    if (req.params.user == null) {
        username = req.username;
    } else {
        username = req.params.user;
    }
    Profile.findOne({username: username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                res.send({"username": result.username, "dob": result.dob});
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const getAvatar = (req, res) => {
    let username;
    if (req.params.user == null) {
        username = req.username;
    } else {
        username = req.params.user;
    }
    Profile.findOne({username: username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                res.send({"username": result.username, "avatar": result.avatar});
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

const updateAvatar = (req, res) => {
    Profile.findOneAndUpdate({username: req.username}, {avatar: req.fileurl})
        .then((result) => {
            res.send({"username": result.username, "avatar": req.fileurl});
        })
        .catch((err) => {
            console.log(err);
        })
}