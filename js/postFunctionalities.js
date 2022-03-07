var socket = io();
const postDictionary = {
    post1: "Lana Reed's",
    post2: "Ariel Simon's",
    post3: "Emma Hanson's",
    post4: "David Cole's",
};
let timeout;

// const { Configuration, OpenAIApi } = require("openai");

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// const response = await openai.createCompletion("text-davinci-001", {
//   prompt: "You: What have you been up to?\nFriend: Watching old movies.\nYou: Did you watch anything interesting?\nFriend:",
//   temperature: 0.5,
//   max_tokens: 60,
//   top_p: 1.0,
//   frequency_penalty: 0.5,
//   presence_penalty: 0.0,
//   stop: ["You:"],
// });

// Socket listening to broadcasts
socket.on("post comment", function(msg) {
    const card = $(".ui.card[postID =" + msg["postID"] + "]");
    let comments = card.find(".ui.comments");
    // no comments area - add it
    if (!comments.length) {
        const buttons = card.find(".three.ui.bottom.attached.icon.buttons");
        buttons.after('<div class="content"><div class="ui comments"></div>');
        comments = card.find(".ui.comments");
    }
    if (msg["text"].trim() !== "") {
        const mess =
            `<div class="comment">
                <a class="avatar"> <img src="${msg["agent"] ? "/profile_pictures/convo_bot.gif" : "/profile_pictures/avatar-icon.svg"}"> </a>
                <div class="content">
                <a class="author">${msg["agent"] ? "Conversational AI Agent" : "Guest"}</a>
                <div class="metadata">
                    <span class="date"><1 minute ago</span>
                    <i class="heart icon"></i> 0 Likes
                </div>
                <div class="text">${msg["text"]}</div>
                </div>
            </div>`;
        comments.append(mess);
    }

    // Display a notification:
    // hide the mobile view popups if not in mobile view anymore
    if ($(window).width() < 1086) {
        $("#removeHiddenMobile").hide();
    } else {
        $("#removeHidden").hide();
    }
    const imageHref = msg["agent"] ? "/profile_pictures/convo_bot.gif" : "/profile_pictures/avatar-icon.svg";
    const text = (msg["agent"] ? "Conversational AI Agent " : "Guest ") + "commented on " + postDictionary[msg["postID"]] + ' post: "' +
        msg["text"] + '".';
    $(".popupNotificationImage").attr("src", imageHref);
    $(".notificationPopup").attr("correspondingpost", msg["postID"]);
    $(".ui.fixed.bottom.sticky.notificationPopup .summary").text(text);

    //if in a mobile view, put popup in the middle
    if ($(window).width() < 1086) {
        $("#removeHiddenMobile").removeClass("hidden").show();
        $("#mobilePopup").transition("pulse");
    } else {
        //else put popup on the side
        $("#removeHidden").removeClass("hidden").show();
        $("#desktopPopup").transition("pulse");
    }

    clearTimeout(timeout);
    timeout = setTimeout(function() {
        if ($("#removeHidden").is(':visible')) {
            $("#removeHidden").transition("fade");
        } else if ($("#removeHiddenMobile").is(':visible')) {
            $("#removeHiddenMobile").transition("fade");
        }
    }, 5000);

    // If is ai bot, and the message was from a user-- scroll to the new comment 
    if (!msg["agent"] && $("input[name='agentCheckbox']").is(":checked")) {
        $(".ui.card[postID =" + msg["postID"] + "]").find('input.newcomment')[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    }
});

function likePost(e) {
    const target = $(event.target);
    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.closest(".ui.like.button").hasClass("red")) {
        // Since the button was already red, this button press is an UNLIKE action.
        // Remove red color from like button and decrease the displayed like count
        target.closest(".ui.like.button").removeClass("red");
        const label = $(this)
            .closest(".ui.like.button")
            .next("a.ui.basic.red.left.pointing.label.count");
        label.html(function(i, val) {
            return val * 1 - 1;
        });
    } else {
        // Since the button was not red, this button press is a LIKE action
        // Add red color to like button and increase the displayed like count
        target.closest(".ui.like.button").addClass("red");
        const label = $(this).next("a.ui.basic.red.left.pointing.label.count");
        label.html(function(i, val) {
            return val * 1 + 1;
        });
    }
}

function flagPost(e) {
    var post = $(this).closest(".ui.card");
    post
        .find(".ui.dimmer.flag")
        .dimmer({
            closable: false,
        })
        .dimmer("show");
    //repeat to ensure its closable
    post
        .find(".ui.dimmer.flag")
        .dimmer({
            closable: true,
        })
        .dimmer("show");
}

function addNewComment(event) {
    let target = $(event.target);
    if (!target.hasClass("link")) {
        target = target.siblings(".link");
    }
    const text = target.siblings("input.newcomment").val();
    const card = target.parents(".ui.fluid.card");
    let comments = card.find(".ui.comments");
    // no comments area - add it
    if (!comments.length) {
        const buttons = card.find(".three.ui.bottom.attached.icon.buttons");
        buttons.after('<div class="content"><div class="ui comments"></div>');
        comments = card.find(".ui.comments");
    }
    if (text.trim() !== "") {
        const mess =
            `<div class="comment">
                <a class="avatar"> 
                    <img src="${$("input[name='agentCheckbox']").is(":checked") ? "/profile_pictures/convo_bot.gif" : "/profile_pictures/avatar-icon.svg"}"> 
                </a>
                <div class="content">
                    <a class="author">${$("input[name='agentCheckbox']").is(":checked") ? "Conversational AI Agent" : "Guest"}</a>
                    <div class="metadata">
                        <span class="date"><1 minute ago</span>
                        <i class="heart icon"></i> 0 Likes
                    </div>
                    <div class="text">${text}</div>
                </div>
            </div>`;

        target.siblings("input.newcomment").val("");
        comments.append(mess);

        socket.emit("post comment", {
            text: text,
            postID: card.attr("postID"),
            agent: $("input[name='agentCheckbox']").is(":checked") // indicates if comment was made as the convo AI agent
        });

        $.post("/feed", {
            sessionID: window.sessionStorage.getItem('Session ID'),
            postID: card.attr("postID"),
            actor: $("input[name='agentCheckbox']").is(":checked") ? "AI" : "Guest",
            body: text
        });
    }
}

function likeComment(e) {
    const target = $(e.target);
    // Determine if the comment is being LIKED or UNLIKED based on the initial
    // button color. Red = UNLIKE, Not Red = LIKE.
    if (target.hasClass("red")) {
        // Since the button was already red, this button press is an UNLIKE action.
        // Remove red color from Like Button and heart icon
        target.removeClass("red");
        const comment = target.parents(".comment");
        comment.find("i.heart.icon").removeClass("red");
        // Decrease the like count by 1
        const label = comment.find("span.num");
        label.html(function(i, val) {
            return val * 1 - 1;
        });
    } else {
        // Since the button was not red, this button press is a LIKE action
        // Add red color to heart icon
        target.addClass("red");
        const comment = target.parents(".comment");
        comment.find("i.heart.icon").addClass("red");
        // Increase the like count by 1
        const label = comment.find("span.num");
        label.html(function(i, val) {
            return val * 1 + 1;
        });
    }
}

function flagComment(e) {
    const comment = $(this).parents(".comment");
    comment.replaceWith(
        `<div class='comment' style='background-color:black;color:white;'>
            <h5 class='ui inverted header'>
                <span>
                The admins will review this comment further. We are sorry you had this experience.
                </span>
            </h5>
        </div>`
    );
}

$(window).on("load", () => {
    // Focuses cursor to new comment input field, if the "Reply" button is clicked
    $(".reply.button").click(function() {
        const parent = $(this).closest(".ui.fluid.card");
        parent.find("input.newcomment").focus();
    });

    // Press enter to submit a comment
    window.addEventListener("keydown", function(event) {
        // console.log(event.target);
        if (event.keyCode === 13 && event.target.className == "newcomment") {
            console.log("newCOMMENT")
            event.stopImmediatePropagation();
            addNewComment(event);
        }
    }, true);

    // like a post
    $(".like.button").click(likePost);

    // flag a post
    $(".flag.button").click(flagPost);

    // create a new Comment
    $("i.big.send.link.icon").click(addNewComment);

    // like a comment
    $("a.like.comment").click(likeComment);

    // flag a comment
    $("a.flag.comment").click(flagComment);

    // closes notification by clicking "x"
    $(".message .close").on("click", function() {
        $(this).closest(".message").transition("fade");
    });

    // scroll to appropriate post when notification popup is clicked
    $('.notificationPopup').on('click', function(event) {
        if ($(event.target).hasClass('close')) {
            return false;
        }

        var relevantPostNumber = $(this).attr('correspondingPost');
        $(".ui.card[postID =" + relevantPostNumber + "]").find('input.newcomment')[0].scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
    });
});