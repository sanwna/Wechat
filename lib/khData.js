$(function () {
    var str = "";
    //记录请求到第几条
    var count = 0;
    // dropload
    var dropload = $('.dive').dropload({
        scrollArea: window,
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
            domNoData: '<div class="dropload-noData">已无数据</div>'
        },
        loadDownFn: function (me) {
            var data = [];
            count += 10
            //ajax方法
            var dataSave = null;
            $.ajax({
                url:"/mmm",
                post:"GET",
                data:{'count':count},
                success:function(backdata) {
                    if(backdata.data){
                        data = backdata.data;
                    }
                }
            })
            setTimeout(function () {
                    if (data.length == 0) {
                        me.resetload();
                        me.lock();
                        me.noData();
                        me.resetload();
                        return;
                    }
                    for(var i = 0; i < data.length; i++) {
                        if(data[i].valid == 1) {
                            x = "保障中"
                        } else {
                            x = "已失效"
                        }
                        var  start = "";

                        if (data[i].productId == '00001' && data[i].proCode == '11') {
                            start="商"
                        }
                        else if(data[i].productId == '00001' && data[i].proCode == '12'){
                            start="交"
                        }
                        else if(data[i].productId != '00001' && data[i].prodCatId == '15'){
                            start="健"
                        }else if(data[i].productId != '00001' && data[i].prodCatId == '16'){
                            start="意"
                        }else if(data[i].productId != '00001' && data[i].prodCatId == '17'){
                            start="财"
                        }else if(data[i].productId != '00001' && data[i].prodCatId == '18'){
                            start="责"
                        }

                        str+=
                            "<div class='ccc'>" +
                            "<div class='porxe'></div>" +
                            "<div class='product'>"+
                            "<div class='shang' >"+start+"</div>" +
                            "<div class='jidongche'>"+data[i].productName+"</div>" +
                            "<div class='zhong' style='border: 0.01rem solid'>"+x+"</div>" +
                            "</div>" +
                            "<div class='xiangmu'> "+
                            "<div class='jine' >" +
                            "<div>保险金额：</div>" +
                            "<div>"+"￥"+data[i].premium+"</div>" +
                            "</div>" +
                            "<div class='jinee' >"+
                            "<div>保&nbsp&nbsp单&nbsp号：</div>" +
                            "<div style='maxLength=15;-o-text-overflow:ellipsis;' class='dome' id="+data[i].id+" >"+data[i].id+"</div>" +
                            "</div> " +
                            "<div class='jineee'>" +
                            "<div>保障时间：</div>" +
                            "<div>"+data[i].startDateTime+"&nbsp至&nbsp"+data[i].endDateTime+ "</div>" +
                            "</div>" +
                            "</div>"+
                            "</div>"
                    }

                    $(".khfxPane").html(str)
                    me.resetload();
                }, 500);
        }
    });
});