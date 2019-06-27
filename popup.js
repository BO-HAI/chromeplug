
var db, db_name = 'hqwx', db_version = 12, userTable = 'users', formTable = 'forms';

var DBOpenRequest = window.indexedDB.open(db_name, db_version);

// DBOpenRequest.onsuccess = function () {
//     console.log('数据库连接成功');
//     db = DBOpenRequest.result;
// };

DBOpenRequest.onupgradeneeded = function (event) {
    // var db = event.target.result;

    var userStore = event.target.result.createObjectStore(userTable, {
        keyPath: 'id',
        autoIncrement: true
    }),
    formStore = event.target.result.createObjectStore(formTable, {
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

    formStore.createIndex('url', 'url');
    formStore.createIndex('form', 'form');
};

(function () {
    var testUser = chrome.extension.getBackgroundPage().testUser;

    DBOpenRequest.onsuccess = function () {
        console.log('数据库连接成功');
        db = DBOpenRequest.result;

        var userStore = db.transaction(userTable).objectStore(userTable);
        userStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                // cursor.value就是数据对象
                // 游标没有遍历完，继续
                testUser[cursor.value.name] = cursor.value.pwd;
                $('.users-block').append('<p class="u_name" data-id="' + cursor.value.name + '" data-method="selectuser" data-type="zdy">' + cursor.value.name + '</p>');
                cursor.continue();
            } else {
                // 如果全部遍历完毕...
                console.log(testUser);
            }
        }
    };

    $('body').on('click', '[data-method]', function () {
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

            case 'analyse':
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {message:"analyse", status: 200}, function(response) {
                    });//end  sendMessage
                }); //end query
            break;

            case 'submit':
                var username = $('[name="username"]').val();
                var password = $('[name="password"]').val();
                // var users = localStorage.getItem('users') === null ? '' : localStorage.getItem('users');

                if ((username !== '') || (password !== '')) {
                    db.transaction(userTable, "readwrite").objectStore(userTable).add({
                        name: username,
                        pwd: password
                    });

                    alert('添加成功！');

                } else {
                    alert('这位童鞋，这块板儿砖是你掉的吗？');
                }
            break;
            case 'changeTab':
                var id = $this.data('tab-id');
                $this.addClass('active').siblings('span').removeClass('active');
                $('.tab-block-' + id).show().siblings('.tab-block').hide();
            break;
        }

    });

    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.message) {
            case 'analyse':
                console.log(request.inputs);
                let $form = $('#analyse-form');
                let html = '';
                if ($form.length === 0) {
                    $('.tab-block-2').append('<form id="analyse-form"></form>');
                }

                for (key in request.inputs) {
                    console.log(key);

                    switch (request.inputs[key].tagname) {

                    }
                }

                $form.append();
            break;
        }
    });
}());
