
var db, db_name = 'hqwx', db_version = 6, userTable = 'users';

var DBOpenRequest = window.indexedDB.open(db_name, db_version);

DBOpenRequest.onsuccess = function () {
    console.log('数据库连接成功');
    db = DBOpenRequest.result;
};

DBOpenRequest.onupgradeneeded = function (event) {
    // var db = event.target.result;

    var userStore = event.target.result.createObjectStore(userTable, {
        keyPath: 'id',
        autoIncrement: true
    });

    userStore.createIndex('id', 'id', {
        unique: true
    });

    userStore.createIndex('name', 'name', {
        unique: true
    });
    userStore.createIndex('pwd', 'pwd');
};


(function () {
    var testUser = chrome.extension.getBackgroundPage().testUser;
    var userlist = localStorage.getItem('users');

    if (userlist) {
        userlist = userlist.split(';');

        userlist.forEach(function (item) {
            if (item.length === 0) {
                return;
            }
            var userinfo = item.split('/');

            testUser[userinfo[0]] = userinfo[1];


            $('.users-block').append('<p class="u_name" data-id="' + userinfo[0] + '" data-method="selectuser" data-type="zdy">' + userinfo[0] + '</p>');
        });
    }

    $('[data-method]').on('click', function () {
        var $this = $(this);
        var method = $this.data('method');

        switch (method) {
            case 'selectuser':
                var username = $this.data('id');
                var pwd = testUser[username];

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

                db.transaction(userTable, "readwrite").objectStore(userTable).add({
                    name: username,
                    pwd: password
                });

            break;
            case 'changeTab':
                var id = $this.data('tab-id');
                $this.addClass('active').siblings('span').removeClass('active');
                $('.tab-block-' + id).show().siblings('.tab-block').hide();
            break;
        }

    });
}());
