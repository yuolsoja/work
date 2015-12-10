/**
 * Created by songjian2 on 12/1/15.
 */
$(function(){
    var scroll = $('.js_timeline').MenuScrollPlugin({
        //回调函数，this是当前li,event事件对象，index为当前li的索引值
        selectCallBack: function(event, index){
            //console.log(this,index,event);
        }
    });
    var timeLine = [];
    scroll.find('li').each(function(i,v){
        timeLine.push({
            index: i,
            time: new Date($(this).data('time')).getTime()
        });
    });

    //timeLine.push({
    //    index: timeLine.length,
    //    time: new Date($(this).data('endtime')).getTime()
    //});
    timeLine.sort(function(x, y){
        if(x.time > y.time) return 1;
        if(x.time < y.time) return -1;
        return 0;
    });
    //初始化状态
    var currentTime=new Date(scroll.find('ul').data('currenttime')).getTime();
    var baseTime = Date.now(),lastIndex = '';
    scroll.setIndex(lastIndex = getIndex(currentTime, timeLine));
    var currentIndex =  getIndex(currentTime, timeLine)
    var txt = scroll.find('.timeaxis-info');
    initText(txt,currentIndex);

    setInterval(function(){
        var currentNow = Date.now();
        var cTime = (currentNow - baseTime) + currentTime;
        var index = getIndex(cTime, timeLine);
        if(index === lastIndex) return ;
        scroll.setIndex(index);
        lastIndex = index;
        initText(txt,index);
    },1000);
    /**
     * 根据当前时间获得相应的index
     * @param currentTime 当前时间
     * @param timeLine li中的时间节点
     * @returns {*}
     */
    function getIndex(currentTime, timeLine){
        for(var i = 0, currentValue; currentValue = timeLine[i++];){
            if(currentTime < currentValue.time) {
                return timeLine[i-2] ? timeLine[i-2].index : '';
            }
        }
        if(i === (timeLine.length+1)) {
            return (timeLine[i-2].index);
        }
    }

    /**
     * 初始化文字部分
     * @param txt 文字数组
     * @param index 当前节点index
     */
    function initText(txt,index) {
        txt.slice(0 ,index).text('已结束');
        txt.slice(index+1).text('未开始');
        txt.eq(index).text('已开抢');
    }

});