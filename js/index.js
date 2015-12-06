/**
 * Created by songjian2 on 12/1/15.
 */
$(function(){
    var scroll = $('.js_timeline').MenuScrollPlugin({
        //回调函数，this是当前li,event事件对象，index为当前li的索引值
        selectCallBack: function(event, index){
            console.log(this,index,event);
        }
    });
    var timeLine = [];
    scroll.find('li').each(function(i,v){
        timeLine.push({
            index: i,
            time: new Date($(this).data('time')).getTime()
        });
    });

    timeLine.sort(function(x, y){
        if(x.time > y.time) return 1;
        if(x.time < y.time) return -1;
        return 0;
    });

    var currentTime=new Date(scroll.find('ul').data('currenttime')).getTime();


    var baseTime = Date.now(),lastIndex = '';
    scroll.setIndex(getIndex(lastIndex = currentTime, timeLine));
    var txt = scroll.find('.timeaxis-info');
    setInterval(function(){
        var currentNow = Date.now();
        var cTime = (currentNow - baseTime) + currentTime;
        var index = getIndex(cTime, timeLine);
        if(index === lastIndex) return ;
        scroll.setIndex(index);
        lastIndex = index;
        txt.slice(0 ,index).text('已结束');
        txt.slice(index+1).text('未开始');
        txt.eq(index).text('已开抢');
    },1000);

    function getIndex(currentTime, timeLine){
        for(var i = 0, currentValue; currentValue = timeLine[i++];){
            if(currentTime < currentValue.time) {
                return (currentValue.index - 1);
            }
        }
        if(i === (timeLine.length+1)) {
            return (timeLine.length - 1);
        }
        return 0;
    }



});