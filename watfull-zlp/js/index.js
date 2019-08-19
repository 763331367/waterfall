$(function () {

    var my_currentPage = 1;  // 定义页码
    var interId = null;  //定义按钮运动计时器

    $('.tips').mousedown(function (e) {
        e = e || window.event;
        if(e.button == 2)return;  //区分鼠标左右键
        $(this).addClass('click');   //鼠标点下后运动
    })
    $('.tips').mouseup(function (e) {  // 点击变....

        e = e || window.event;  //区分鼠标左右键
        if(e.button == 2)return;

        clearInterval(interId);  //清除计时器

        $(this).removeClass('click');  //清除鼠标点击样式

        if($(this).hasClass('disabled')==true){  //最后一页点击时添加样式
            alert('当前已是最后一页了');
            return;
        }

        $(this).html('.');  //修改按钮样式
        var $this = $(this);
        interId = setInterval(function () {
            var oldStr = $this.html();
            if (oldStr.length > 12) {  // 判断长度是否大于16个点
                oldStr = '';
            }
            oldStr += '.';  // 累加 .
            $this.html(oldStr);  // 赋值给元素的内容
        }, 100)

        // ajax获取数据
        $.ajax({
            url: 'api/waterFall_smile.php',
            type: 'post',
            data: {
                currentPage: my_currentPage,
                pageSize: 40,
                fitWidth: true
            },
            success: function (data) {

                clearInterval(interId);  // 清除定时器
                $('.tips').html(data.currentPage + '/' + data.totalPage);  // 修改按钮内容为 1/xx

                // 引用模板引擎渲染页面
                var result = template('template', data);
                var $dom = $(result);

                //瀑布流插件
                $('.items').masonry({
                    transitionDuration: 0  //没有过渡动画
                }).append($dom).masonry('appended', $dom).masonry();  //允许多次添加内容

                // 页码 累加
                my_currentPage++;

                // 判断是否是最后一页
                if(data.currentPage == data.totalPage){
                    $('.tips').addClass('disabled');  // 添加按钮类名
                }
            },
            error:function () {  //输出错误信息
                for(var i in arguments){
                    console.log(i);
                }
            }
        })
    })
})