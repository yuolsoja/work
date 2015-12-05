/**
 * Created by songjian2 on 12/1/15.
 */
$(function(){
    /*var oUl=document.getElementsByClassName("timeline")[0].getElementsByTagName("ul")[0];
     var menu=oUl.getElementsByTagName("li");
     for(var i=0;i<menu.length;i++){
     menu[i].onclick=function(){
     for(i=0;i<menu.length;i++){
     menu[i].className="";
     }
     this.className="ac";
     }
     }

     function tab(){
     var timeLine=$('.timeline')[0];
     var timeLineWidth=timeLine.scrollWidth;

     }
     tab();*/
    var scroll = $('.js_timeline').MenuScrollPlugin({
        currentIndex: 5,
        selectCallBack: function(event, index){
            console.log(this, event, index);
        }
    });

    setTimeout(function(){
        scroll.setIndex(12);
    },1000);

});