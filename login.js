function randomColor () {
    var i = 0,
        str = "#",
        random = 0,
        aryNum = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

    for(i = 0; i < 6; i++)
    {
    	random = parseInt(Math.random() * 16);

    	str += aryNum[random];
    }

    return str;
}

(function () {
    function getQueryString () {
        var reg = new RegExp('(^|&)@name=([^&]*)(&|$)'.replace('@name', name), 'i'),
            r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    var u = localStorage.getItem('chrome_hqwz_username');
    var p = localStorage.getItem('chrome_hqwz_password');

    if (u && p && location.href.indexOf('login') > -1) {
        // alert(u);
        // alert(p);
        document.getElementById("gEdu-loginDialog-account").value = u;
        document.getElementById("gEdu-loginDialog-pwd").value = p;

        var button = document.getElementsByClassName('submit-button')[0];

        button.click();
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        switch (request.message) {
            case 'selectuser':
                // document.getElementById("gEdu-loginDialog-account").value = request.username;
                // document.getElementById("gEdu-loginDialog-pwd").value = request.pwd;
                //
                // var button = document.getElementsByClassName('submit-button')[0];
                //
                // button.click();
                // alert(request.username);
                // alert(request.pwd);
                if (location.href.indexOf('login') > -1) {
                    return;
                }

                var iframe = document.createElement('iframe');
                var body = document.getElementsByTagName('body')[0];
                //style="width:0;height:0" id="webApiRequestIframe" name="webApiRequestIframe
                iframe.setAttribute('width', '0');
                iframe.setAttribute('height', '0');
                iframe.setAttribute('id', 'chrome-ex-hqwx-exit-iframe');
                iframe.setAttribute('name', 'chrome-ex-hqwx-exit-iframe');
                iframe.setAttribute('src', 'http://www.hqwx.com/user_center/v2/html/exit.html');
                body.appendChild(iframe);

                localStorage.setItem('chrome_hqwz_username', request.username);
                localStorage.setItem('chrome_hqwz_password', request.pwd);

                setTimeout(function () {
                    location.href = 'http://www.hqwx.com/login/?chromeu=' + request.username + '&chromep=' + request.pwd + '&gotohere=' + encodeURIComponent(location.href);
                }, 500);
                sendResponse('');
            break;

            case 'exit':
                var iframe = document.createElement('iframe');
                var body = document.getElementsByTagName('body')[0];
                //style="width:0;height:0" id="webApiRequestIframe" name="webApiRequestIframe
                iframe.setAttribute('width', '0');
                iframe.setAttribute('height', '0');
                iframe.setAttribute('id', 'chrome-ex-hqwx-exit-iframe');
                iframe.setAttribute('name', 'chrome-ex-hqwx-exit-iframe');
                iframe.setAttribute('src', 'http://www.hqwx.com/user_center/v2/html/exit.html');
                body.appendChild(iframe);

                localStorage.clear();

                setTimeout(function () {
                    location.href = 'http://www.hqwx.com/login/?gotohere=' + encodeURIComponent(location.href);
                }, 500);
                sendResponse('');
            break;
            case 'analyse':
                console.log(request.status);
                $('input, select, textarea').each(function (index, item) {
                    let color = randomColor();
                    if (color === '#ffffff' || color === '#000000') {
                        color = randomColor();
                    }
                    let colorNumber = color.substring(1, color.length);
                    
                    let $dev = $('<dev id="chrome-ex-color-' + colorNumber + '"></dev>');
                    $dev.css({
                        'width': '100px',
                        'height': '30px',
                        'background': color,
                        'line-height': '30px',
                        'text-align': 'center',
                        'color': '#ffffff',
                        'padding': '5px 10px',
                        'border': '1px solid #000000'
                    }).text(color);
                    $('body').append($dev);

                    $(item).css({
                        'border': '2px solid ' + color,
                        // 'width': '100%',
                        // 'height': '28px',
                        'display': 'block',
                        'opacity': 1
                    });
                });


                // $('input, select').css({
                //     'border': '2px solid ' + randomColor()
                // });

                sendResponse('');
                // console.log(document.getElementsByTagName('input'));
            // break;
        }
        //Error: Unchecked runtime.lastError: The message port closed before a response wa received.
        sendResponse('');
    })
}());
