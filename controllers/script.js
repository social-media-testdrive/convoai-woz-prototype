const Script = require('../models/Script.js');
const _ = require('lodash');

/**
 * POST /feed: Post a comment to Script collection.
 */
exports.postComment = (req, res, next) => {
    Script.findOne({ sessionID: req.body.sessionID })
        .exec(function(err, script) {
            if (err) {
                return next(err);
            }

            // There is no corresponding object for this session ID, so create one
            if (!script) {
                script = new Script({
                    sessionID: req.body.sessionID,
                    action: []
                });
            }

            let userAction = script.action;

            // Find the object for this post
            let feedIndex = _.findIndex(userAction, function(o) {
                return o.post_id == req.body.postID;
            });

            // There is no corresponding object for this post, so create one 
            if (feedIndex == -1) {
                let cat = {};
                cat.post_id = req.body.postID;
                cat.comments = [];
                feedIndex = userAction.push(cat) - 1;
            }

            // Create a new Comment
            let comment = {};
            comment.actor = req.body.actor;
            comment.body = req.body.body;
            comment.time = Date.now();

            userAction[feedIndex].comments.push(comment);

            script.save((err) => {
                if (err) {
                    return next(err);
                }
                res.send({
                    result: "success"
                });
            });
        });
};

/**
 * GET /:sessionID: Get the comments logged for the sessionID
 */
exports.getScript = (req, res, next) => {
    Script.findOne({ sessionID: req.params.sessionID })
        .exec(function(err, script) {
            if (err) {
                return next(err);
            }

            let final_script = {};
            if (script) {
                for (const post of script["action"]) {
                    final_script[post["post_id"]] = post["comments"];
                }
            }

            console.log(final_script);
            res.render('index', {
                script: final_script
            });
        });
};