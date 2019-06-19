// alert("I Love Flutter");



(function () {
    var info = chrome.extension.getBackgroundPage().hqwx_users;


    var userlist = localStorage.getItem('users');


    if (userlist) {
        userlist = userlist.split(';');

        userlist.forEach(function (item) {
            if (item.length === 0) {
                return;
            }
            var userinfo = item.split('/');

            info[userinfo[0]] = userinfo[1];


            $('.users-block').append('<p class="u_name" data-id="' + userinfo[0] + '" data-method="selectuser" data-type="zdy">' + userinfo[0] + '</p>');
        });
    }

    $('[data-method]').on('click', function () {
        var $this = $(this);
        var method = $this.data('method');

        switch (method) {
            case 'selectuser':
                var username = $this.data('id');
                var pwd = info[username];

                // localStorage.setItem('chrome_hqwz_username', username);
                // localStorage.setItem('chrome_hqwz_password', pwd);

                $this.addClass('active').siblings('.u_name').removeClass('active');
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                	chrome.tabs.sendMessage(tabs[0].id, {message:"selectuser", pwd: pwd, username: username}, function(response) {
                	});//end  sendMessage
                }); //end query
            break;

            case 'exit':
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {message:"exit"}, function(response) {
                });//end  sendMessage
            }); //end query
            break;

            case 'submit':
                var username = $('[name="username"]').val();
                var password = $('[name="password"]').val();
                var users = localStorage.getItem('users') === null ? '' : localStorage.getItem('users');

                if ((username !== '') || (password !== '')) {
                    localStorage.setItem('users', users + username + '/' + password + ';');

                    alert('添加成功!');
                } else {
                    alert('这位童鞋，这块板儿砖是你掉的吗？');
                }
            break;
        }

    });
}());
