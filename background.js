var hqwx_users = {
    huanju12: '123456',
    huanju13: '123456yy',
    huanju14: '123456yy',
    cs11: '123456',
    15652824466: '123456'
}

 chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    // document.getElementById("gEdu-loginDialog-account").value="huanju13";
    // document.getElementById("gEdu-loginDialog-pwd").value="123456yy";

    sendResponse(hqwx_users);
});
