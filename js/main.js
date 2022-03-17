function updateNewCommentImage() {
    const isAgent = window.sessionStorage.getItem('isAgent');
    let src = isAgent === "true" ? "/profile_pictures/convo_bot.png" : "/profile_pictures/avatar-icon.svg";
    console.log(isAgent);
    console.log(src);
    if (window.location.pathname !== "/") {
        $(".extra.content > .input > .ui.label > img.ui.avatar.image").attr("src", src);
    }
}

$(window).on("load", function() {
    const initialIsAgent = window.sessionStorage.getItem('isAgent');
    if (initialIsAgent === 'true') {
        $('#isAgentCheckbox input').prop('checked', true);
    }
    $('#isAgentCheckbox').removeClass("hidden");
    updateNewCommentImage();

    $('#isAgentCheckbox').change(function() {
        if ($("input[name='isAgentCheckbox']").is(":checked")) {
            window.sessionStorage.setItem('isAgent', 'true');
        } else {
            window.sessionStorage.setItem('isAgent', 'false');
        }
        updateNewCommentImage();
    })
});