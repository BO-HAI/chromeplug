
var db, db_name = 'hqwx',
    db_version = 23,
    userTable = 'users',
    formTable = 'forms',
    formObj = null,
    formUrl = '';

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

    formStore.createIndex('url', 'url', {
        unique: false
    });
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
            // 分析用户页面表单请求
            case 'analyse_user_page':
                let select = $('#form-select').val();

                if (select === '-1') {
                    select = '';
                }
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {message:"analyse_user_page", status: 200, select: select}, function(response) {
                    });//end  sendMessage
                }); //end query
            break;
            // 提交用户信息
            case 'submit_account':
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
            // 切换tab
            case 'changeTab':
                var id = $this.data('tab-id');
                $this.addClass('active').siblings('span').removeClass('active');
                $('.tab-block-' + id).show().siblings('.tab-block').hide();

                if (id === 2) {
                    // tab2 触发指定函数
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                        chrome.tabs.sendMessage(tabs[0].id, {message:'get_user_page_forms', status: 200}, function(response) {
                        });//end  sendMessage
                    }); //end query
                }

                if (id === 3) {
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                        chrome.tabs.sendMessage(tabs[0].id, {message:'get_url', status: 200}, function(response) {
                        });//end  sendMessage
                    }); //end query

                    // let formStore = db.transaction(formTable).objectStore(formTable);
                    // // formStore.openCursor(IDBKeyRange.only(formUrl)).onsuccess = function(event) {
                    // //     console.log(event.target.result);
                    // // }
                    //
                    // let index = formStore.index('url');
                    // index.getAll(formUrl).onsuccess = function (e) {
                    //     console.log(e.target.result);
                    //
                    //     let $vformBlock = $('<div class="virtual-form-group"></div>');
                    //
                    //     e.target.result.forEach(function (item, index) {
                    //         let $vform = $('<div class="virtual-form">表单' + (index + 1) + '</div>');
                    //         let str = JSON.stringify(item).replace(/"/g, "'");
                    //
                    //         $vform.attr('data-db-val', str);
                    //         $vform.attr('data-db-id', item.id);
                    //         console.log(item);
                    //         $vformBlock.append($vform);
                    //     });
                    //
                    //     $('.tab-block-3').html('').append($vformBlock);
                    // };
                }
            break;
            // 提交表单分析结果
            case 'submit_analyse_result':
                db.transaction(formTable, "readwrite").objectStore(formTable).add({
                    url: formUrl,
                    form: formObj
                });

                alert('添加成功！');
            break;

            case 'render_to_user_page':
                let jsonStr = $this.data('db-val');
                let json = JSON.parse(jsonStr.replace(/'/g, '"'));
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                    chrome.tabs.sendMessage(tabs[0].id, {message:"render_to_user_page", status: 200, json: json}, function(response) {
                    });//end  sendMessage
                }); //end query
            break;
        }

    });

    /**
     * 响应页面请求              [description]
     */
    chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.message) {
            case 'analyse_render':
                console.log(request.inputs);
                formObj = request.inputs;
                formUrl = request.url;
                let $form = $('#analyse-form');
                let html = '';
                // if ($form.length === 0) {
                //     $form = $('<form id="analyse-form"></form>');
                //     $('.tab-block-2').append($form);
                // }

                // for (key in request.inputs) {
                //     console.log(key);
                //
                //     request.inputs[key].type = request.inputs[key].type === undefined ? '' : request.inputs[key].type;
                //
                //     html += '<div class="form-group" id="' + key + '" style="background: #' + key + '"><label>' + request.inputs[key].name + '</label><input type="text" value="' + request.inputs[key].value + '" placeholder="' + key + '"><span>' + request.inputs[key].tagname + ' | ' + request.inputs[key].type + '</span></div>';
                // }

                formObj.forEach(function (item) {
                    item.type = item.type === 'undefined' ? '' : item.type;
                    html += '<div class="form-group" id="' + item.color + '" style="background:' + item.color + '"><label>' + item.name + '</label><input type="text" value="' + item.value + '" placeholder="' + item.color + '"><span>' + item.tagname + ' | ' + item.type + '</span></div>';
                });

                $form.html(html);

                console.log(request.url);

            break;

            case 'forms_render':
                console.log('====响应页面：getForms====');
                console.log(request);
                formUrl = request.url;
                $('#form-select').html('<option value="-1">--请选择--</option>');
                request.forms.forEach(function (item) {
                    if (item.id) {
                        $('#form-select').append('<option value="#' + item.id + '">#' + item.id + '</option>');
                    } else if (item.klass) {
                        $('#form-select').append('<option value=".' + item.klass.replace(/ /g, ".") + '">.' + item.klass.replace(/ /g, ".") + '</option>');
                    } else {
                        $('#form-select').append('<option value="form">无名表单</option>');
                    }
                });
            break;

            case 'set_url':
                formUrl = request.url;

                // 获取表单
                let formStore = db.transaction(formTable).objectStore(formTable);
                // formStore.openCursor(IDBKeyRange.only(formUrl)).onsuccess = function(event) {
                //     console.log(event.target.result);
                // }

                let index = formStore.index('url');
                index.getAll(formUrl).onsuccess = function (e) {
                    console.log(e.target.result);

                    let $vformBlock = $('<div class="virtual-form-group"></div>');

                    e.target.result.forEach(function (item, index) {
                        let $vform = $('<div class="virtual-form">表单' + (index + 1) + '</div>');
                        let str = JSON.stringify(item).replace(/"/g, "'");

                        $vform.attr('data-db-val', str);
                        $vform.attr('data-db-id', item.id);
                        $vform.attr('title', str);
                        $vform.attr('data-method', 'render_to_user_page');
                        console.log(item);
                        $vformBlock.append($vform);
                    });

                    $('.tab-block-3').html('').append($vformBlock);
                };
            break;
        }
    });
}());
