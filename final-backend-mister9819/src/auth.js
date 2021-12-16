const bcrypt = require('bcrypt');
const saltRounds = 10;

const Profile = require("./schema/profileSchema");
const User = require("./schema/userSchema")

REDIS_URL = "redis://:p0fb6912a207506a41460e3726393aed5dbaa7cdf7aeca428d686f0742bb44455@ec2-52-0-105-255.compute-1.amazonaws.com:21149"
const redis = require('redis').createClient(REDIS_URL);

let cookieKey = "sid";

function isLoggedIn(req, res, next) {
    // likely didn't install cookie parser
    if (!req.cookies) {
       return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    }

    redis.hmget('sessions', sid, function (err, object) {
        if (object[0] == null) {
            return res.sendStatus(401)
        }
        username = JSON.parse(object)
        req.username = username;
        next();
    })
}

function glogin(req, res) {
    let user = req.cookies["gcookie"]
    User.findOne({"gid": user.id})
        .then((result) => {
            if (result == null) { // Not linked
                res.sendStatus(401)
            } else {
                let sid = result.password + new Date().getTime();
                redis.hmset('sessions', sid, JSON.stringify(result.username))

                // Adding cookie for session id
                res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true, secure: true, sameSite: "none"});
                res.send({username: result.username, result: 'success'});
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function login(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    // supply username and password
    if (!username || !password) {
        return res.sendStatus(400);
    }

    User.findOne({"username": username})
        .then((result) => {
            if (result == null) { // Wrong username
                res.sendStatus(401)
            } else {
                let cur_password = result.password;
                bcrypt.compare(password, cur_password)
                    .then(function(result) {
                        if(result) { // Correct password
                            let sid = cur_password + new Date().getTime();
                            redis.hmset('sessions', sid, JSON.stringify(username))

                            // Adding cookie for session id
                            res.cookie(cookieKey, sid, { maxAge: 3600 * 1000, httpOnly: true, secure: true, sameSite: "none"});
                            res.send({username: username, result: 'success'});
                        } else {
                            res.sendStatus(401);
                        }
                    });
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

function register(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let gid = req.body.gid;

    if (gid == "") {
        bcrypt.hash(password, saltRounds).then(function(hash) {
            const user = new User({
                username: username,
                password: hash,
                gid: "false"
            });

            let profile = new Profile({
                username: username,
                email: req.body.email,
                headline: " ",
                dob: Date.parse(req.body.dob),
                zipcode: req.body.zipcode,
                following: [],
                avatar: "https://i.stack.imgur.com/34AD2.jpg"
            });

            user.save()
                .then((result) => {
                    profile.save()
                        .then((result) => {
                            login(req, res);
                        })
                        .catch((err) => {
                            console.log(err)
                            User.findOneAndDelete({},{"sort": { "_id": -1 }}) // Delete last added record in user table
                                .then((result) => {
                                    res.status(400).send("Duplicate email");
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
                        })
                })
                .catch((err) => {
                    res.status(400).send("Duplicate username.");
                });
        });
    } else if (password == "") {
        const user = new User({
            username: username,
            password: " ",
            gid: gid
        });

        let profile = new Profile({
            username: username,
            email: req.body.email,
            headline: " ",
            dob: Date.parse(req.body.dob),
            zipcode: req.body.zipcode,
            following: [],
            avatar: "https://i.stack.imgur.com/34AD2.jpg"
        });

        user.save()
            .then((result) => {
                profile.save()
                    .then((result) => {
                        res.cookie("gcookie", {id: gid}, { maxAge: 20000, httpOnly: true, secure: true, sameSite: "none"});
                        glogin(req, res);
                    })
                    .catch((err) => {
                        console.log(err)
                        User.findOneAndDelete({},{"sort": { "_id": -1 }}) // Delete last added record in user table
                            .then((result) => {
                                res.status(400).send("Duplicate email");
                            })
                            .catch((err) => {
                                console.log(err);
                            })
                    })
            })
            .catch((err) => {
                res.status(400).send("Duplicate username.");
            });
    }
}

const updatePassword = (req, res) => {
    let password = req.body.password;

    if (!password) {
        return res.sendStatus(400);
    }
    bcrypt.hash(password, saltRounds).then(function(hash) {
        User.findOneAndUpdate({username: req.username}, {password: hash})
            .then((result) => {
                res.send({"username": result.username, "result": "success"});
            })
            .catch((err) => {
                console.log(err);
            })
    });
}

const logout = (req, res) => {
    if (!req.cookies) {
        return res.sendStatus(401);
    }

    let sid = req.cookies[cookieKey];

    // no sid for cookie key
    if (!sid) {
        return res.sendStatus(401);
    } else {
        req.user = "";
        redis.del('sessions', sid, function (err, object) {
            res.send("OK");
        });
    }
};


function link (req, res) {
    let user = req.cookies["gcookie"]
    if (user == undefined) {
        User.findOneAndUpdate({username: req.username}, {gid: "false"})
            .then((result) => {
                res.send({"username": result.username, "result": "failure"});
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        User.findOne({"gid": user.id})
            .then((result) => {
                if (result == null) { // Not linked
                    User.findOneAndUpdate({username: req.username}, {gid: user.id})
                        .then((result) => {
                            res.send({"username": result.username, "result": "success"});
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                } else {
                    res.send({"username": result.username, "result": "exists"});
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

const unlink = (req, res) => {
    User.findOneAndUpdate({username: req.username}, {gid: "false"})
        .then((result) => {
            res.send({"username": result.username, "result": "success"});
        })
        .catch((err) => {
            console.log(err);
        })
}

const isLinked = (req, res) => {
    User.findOne({username: req.username})
        .then((result) => {
            if (result == null) {
                res.status(404).send("Wrong username.");
            } else {
                let r = "";
                if (result.password == ' ') {
                    r = "unlinkable"
                } else if (result.gid == "fase") {
                    r = "link"
                } else if (result.gid == "false") {
                    r = "false"
                } else {
                    r = "true"
                }
                res.send({"username": result.username, "result": r});
            }
        })
        .catch((err) => {
            console.log(err);
        })
}

const linking = (req, res) => {
    User.findOneAndUpdate({username: req.params.username}, {gid: "fase"})
        .then((result) => {
            res.send({"username": result.username, "result": "success"});
        })
        .catch((err) => {
            console.log(err);
        })
}

function ginfo (req, res) {
    let user = req.cookies["gcookie"]
    res.send({username: user.username, email: user.email, gid: user.id})
}

function clearginfo (req, res) {
    req.cookies["gcookie"] = undefined;
    res.send({result: "success"});
}


module.exports = (app) => {
    app.put('/logout', logout);
    app.post('/login', login);
    app.post('/glogin', glogin);
    app.post('/register', register);
    app.get('/ginfo', ginfo);
    app.get('/clearginfo', clearginfo)
    app.use(isLoggedIn);
    app.put('/linking/:username', linking);
    app.put('/unlink', unlink);
    app.get('/link', link);
    app.get('/islinked', isLinked)
    app.put('/password', updatePassword);
}
