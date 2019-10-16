
const Comment = require('../models/Comment');
const Image = require('../models/Image');

module.exports = {

    getImages: (req, res) => {
        const page = req.query.page;
        if (page === 'home') {
            Image.aggregate([{
                $lookup: {
                    from: 'users',
                    localField: 'uploader',
                    foreignField: '_id',
                    as: 'uploader'
                }
            }])
                .then(images => { res.status(200).json({ images }) })
                .catch(err => res.status(400).json({ msg: err.message }));
        } else if (page === 'profile') {
            Image.aggregate([{
                $match: { uploader: req.user._id }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'uploader',
                    foreignField: '_id',
                    as: 'uploader'
                }
            }])
                .then(images => res.status(200).json({ images }))
                .catch(err => res.status(400).json({ msg: err.message }));
        } else
            res.status(400).json({
                msg: 'Bad Request'
            });
    },

    uploadImage: (req, res) => {
        console.log(req.file)
        if (req.user) {
            const image = new Image();
            image.uploader = req.user._id;
            image.title = req.body.title;
            image.description = req.body.description;
            image.filename = req.file.filename;
            image.path = `/img/uploads/${req.user.username}/${req.file.filename}`;
            image.originalname = req.file.originalname;
            image.mimetype = req.file.mimetype;
            image.size = req.file.size;
            image.save().then(image => {

                return res.status(200).json({
                    msg: 'Image Uploaded!'
                })
            }).catch(err => res.status(400).json({ msg: err.message }));
        } else {
            return res.status(401).json({
                msg: 'Must be logged in to upload images.'
            });
        }
    },

    addComment: (req, res) => {
        if (req.user !== null) {
            const comment = new Comment({ ...req.body.comment });
            comment.commenter = req.user._id;
        }
    },

    addLike: (req, res) => {
        if (req.user !== null) {
            Image.findOne({ _id: req.params.id }).then(image => {
                if (image.likes.find(req.user) !== -1) {
                    image.updateOne({
                        $set: {
                            likes: [...likes, req.user]
                        }
                    }).then(img => {
                        res.status(200).json({
                            ok: true,
                            msg: 'Like added'
                        })
                    })

                } else {
                    res.status(203).json({
                        ok: false,
                        msg: 'You already liked this post'
                    });
                }
            })
        } else {
            res.status(403).json({
                ok: false,
                msg: "You're not logged in"
            })
        }
    }
}