const Article = require("./schema/articleSchema")
const Profile = require('./schema/profileSchema');
const uploadImage = require('./uploadCloudinary')

module.exports = (app) => {
    app.get('/articles/:id?', getArticles);
    app.post('/article', uploadImage('title'), addArticle);
    app.put('/articles/:id', updateArticle);
}

const getArticles = (req, res) => {
    if (req.params.id === undefined) { // No parameter provided
        Profile.findOne({username: req.username})
            .then((result) => {
                if (result == null) {
                    res.status(404).send("Wrong username.");
                } else {
                    let usernames = result.following;
                    usernames.push(result.username);
                    Article.find({author: {$in: usernames}}).sort({createdAt: -1}).limit(10)
                        .then((result) => {
                            res.send({articles: result});
                        })
                        .catch((err) => {
                            console.log(err)
                        });
                }
            })
            .catch((err) => {
                console.log(err);
            })

    } else { // Parameter provided
        var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$")

        if (checkForHexRegExp.test(req.params.id)) { // Valid article id
            Article.findById(req.params.id)
                .then((result) => {
                    if (result != null) {
                        res.send({articles: result});
                    } else {
                        res.status(404).send("Wrong article id.");
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else { // Try for username
            Profile.findOne({username: req.params.id})
                .then((result) => {
                    if (result == null) {
                        res.status(404).send("Wrong username.");
                    } else {
                        let usernames = result.following;
                        usernames.push(result.username);
                        Article.find({author: {$in: usernames}}).sort({createdAt: -1})
                            .then((result) => {
                                res.send({articles: result});
                            })
                            .catch((err) => {
                                console.log(err)
                            });
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
};

const addArticle = (req, res) => {
    title = req.body.title;
    if (title == null) {
        title = " ";
    }
    image = req.body.image;
    if (req.fileurl == null) {
        image = " ";
    } else {
        image = req.fileurl;
    }
    const article = new Article({
        title: title,
        text: req.body.text,
        image: image,
        comments: [],
        author: req.username
    });

    article.save()
        .then((result) => {
            getArticles(req, res);
        })
        .catch((err) => {
            console.log(err);
        });
}

const updateArticle = (req, res) => {
    cid = req.body.commentId;
    if (cid == null) { // Update article
        Article.findByIdAndUpdate(req.params.id, {text: req.body.text})
            .then((result) => {
                getArticles(req, res);
            })
            .catch((err) => {
                console.log(err);
            });
    } else if (parseInt(cid) === -1) { // New comment
        Article.findById(req.params.id)
            .then((result) => {
                result.comments.push({text: req.body.text, author: req.username});
                result.save()
                    .then((result) => {
                        getArticles(req, res);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                console.log(err);
            });
    } else { // Update existing comment
        Article.findById(req.params.id)
            .then((result) => {
                const comment = result.comments.id(cid);
                comment.set(req.body);
                return result.save();
            })
            .then((result) => {
                getArticles(req, res);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}