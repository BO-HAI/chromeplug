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
    function getQueryString (name) {
        var reg = new RegExp('(^|&)@name=([^&]*)(&|$)'.replace('@name', name), 'i'),
            r = window.location.search.substr(1).match(reg);
        if (r !== null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    // var u = localStorage.getItem('chrome_hqwz_username');
    // var p = localStorage.getItem('chrome_hqwz_password');
    var u = getQueryString('chromeu');
    var p = getQueryString('chromep');

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

            case 'analyse_user_page':
                console.log(request.status);
                let inputObj = []; // 传递给popup的表单元素对象数组
                let $inputs = null;

                /**
                 * 分析页面上的表单元素
                 */
                if ($('#chrome-ex-colors').length === 0) {
                    $('body').append('<dev id="chrome-ex-colors"></dev>');
                } else {
                    $('#chrome-ex-colors').html('');
                }

                if (request.select === '') {
                    $inputs = $('input, select, textarea');
                } else {
                    $inputs = $(request.select).find('input, select, textarea');
                }

                $inputs.each(function (index, item) {
                    let color = randomColor();
                    let $item = $(item);

                    let offset = $item.offset();
                    let tagName = $item.prop('tagName');
                    let type =  $item.attr('type');
                    let name = $item.attr('name');
                    let id = $item.attr('id');
                    let klass = $item.attr('class');
                    let value = $item.val();

                    if (color === '#ffffff' || color === '#000000') {
                        color = randomColor();
                    }
                    let colorNumber = color.substring(1, color.length);

                    let $div = $('<div data-method="chrome_ex_hide" data-color="' + color + '" id="chrome-ex-color-' + colorNumber + '"></div>');

                    $('#chrome-ex-colors').append($div); // 先加入页面 是为了计算宽度

                    if (type !== 'hidden') {
                        $div.css({
                            'width': 'atuo',
                            'height': '30px',
                            'background': color,
                            'line-height': '30px',
                            'text-align': 'center',
                            'color': '#ffffff',
                            'padding': '0 10px',
                            'border': '1px solid #000000',
                            'position': 'absolute',
                            'top': offset.top + 'px',
                            'left': offset.left + 'px',
                            'z-index': 9999999
                        })
                        .html(color + '<p></p>');

                        $div.css({
                            'margin-left': ($div.width() + 30) * -1 + 'px',
                        });
                    } else {
                        // 隐藏表单
                        $div.css({
                            'width': 'auto',
                            'height': '30px',
                            'background': color,
                            'line-height': '30px',
                            'text-align': 'center',
                            'color': '#ffffff',
                            'padding': '0 10px',
                            'border': '1px solid #000000',
                            'position': 'relative'
                        })
                        .html(color + '<p></p>');
                    }

                    $div.find('p').css({
                        'position': 'absolute',
                        'opacity': 0,
                        'top': '-21px',
                        'left': 0,
                        'background': '#2f2f2f',
                        'white-space': 'nowrap',
                        'height': '12px',
                        'line-height': '12px',
                        'padding': '3px 10px',
                        'border-radius': '3px',
                        'font-size': '12px'
                    }).text('[tagName="' + tagName + '"] [id="' + id + '"] [type="' + type + '"] [name="' + name + '"] [class="' + klass + '"] [value="' + value + '"]');

                    $div
                    .mouseenter(function(){
                        $(this).find('p').css({
                            'opacity': 1
                        });
                    })
                    .mouseleave(function(){
                        $(this).find('p').css({
                            'opacity': 0
                        });
                    });

                    $item.css({
                        'border': '2px solid ' + color,
                        'display': 'block',
                        'opacity': 1
                    });

                    inputObj.push({
                        id,
                        name,
                        klass,
                        type,
                        tagname: tagName,
                        value,
                        color: color
                    });
                });

                console.log(inputObj);

                chrome.runtime.sendMessage({message: 'analyse_render', inputs: inputObj, url: location.href});

                /**
                 * 写空回调函数会报告一个错误：Unchecked runtime.lastError: The message port closed before a response was received.
                 */
                // chrome.runtime.sendMessage({message: 'analyse_render', inputs: inputObj}, function (response) {
                //
                // });

                sendResponse('');

            break;

            // 获取页面上的所有表单
            case 'get_user_page_forms':
                let forms = [];
                let url = location.href;

                $('form').each(function (index, item) {
                    let $this = $(item);

                    forms.push({
                        id: $this.attr('id'),
                        klass: $this.attr('class')
                    });
                });

                chrome.runtime.sendMessage({message: 'forms_render', forms: forms, url: url});
            break;
        }
        //Error: Unchecked runtime.lastError: The message port closed before a response wa received.
        sendResponse('');
    });
}());
