;(function($, w){

    /**
     * 检测当前设置是否支持touch事件
     * @returns {boolean}
     */
    function checkDriveSupportTouch(){
        return 'ontouchstart' in w;
    }


    /**
     * 通过事件对象，来获取对应的相对位置度
     * @param e 事件对象e
     * @returns {*|void}
     */
    function getCoord(e) {
        var touches = e;
        if(e.touches && e.touches.length){
            touches = e.touches[0];
        }
        if(e.changedTouches && e.changedTouches.length){
            touches = e.changedTouches[0];
        }
        return {
            x: touches.clientX,
            y: touches.clientY
        };
    }

    /**
     * 计算两个坐标差值
     * @param tCoord 目标度坐标
     * @param bCoord 基准坐标
     * @returns {{dx: number, dy: number}}
     */
    function calcCoord(tCoord, bCoord){
        return {
            dx: tCoord.x - bCoord.x,
            dy: tCoord.y - bCoord.y
        };
    }


    /**
     * 设置位置
     * @param ele [htmlElement]当前dom节点
     * @param tran {x,y}设置目标位置偏移量
     * @param pos [min, max] 边界条件
     * @param needCloseAnimate [string]是否需要移除动画class,如果需要则直接传入className
     */
    function setPosition(ele, tran, limit){
        var targetX = tran.dx || 0;
        targetX = targetX < limit[0] ? limit[0] : targetX;
        targetX = targetX > limit[1] ? limit[1] : targetX;
        targetX = 'translateX('+ parseInt(targetX,10) +'px) translateZ(0px)';
        ele.css({
            '-webkit-transform': targetX,
            '-moz-transform': targetX,
            '-ms-transform': targetX,
            'transform': targetX
        });
    }

    /**
     * 获取当前的水平偏移量
     */
    function getCurrentScroll(ele){
        return ele.get(0).getBoundingClientRect().left;
    }

    $.fn.MenuScrollPlugin = function(option){
        option = $.extend({}, $.fn.MenuScrollPlugin.defaults, option);

        var items = this.find(option.itemsSelector),
            itemsLength = items.length,
            itemWrap = this.find(option.itemsWrapSelector),
            eventName = (option.autoCheckMobile && checkDriveSupportTouch()) ? {
                start: 'touchstart',
                end: 'touchend',
                move: 'touchmove',
                click: 'touchend'
            } : {
                start: 'mousedown',
                end: 'mouseup',
                move: 'mousemove',
                click: 'click'
            },
            wrapWidth = this.get(0) ? this.get(0).scrollWidth : '',
            realWidth = this.width(),
            $document = $(document),
            limit = [realWidth - wrapWidth,0],
            checkisTrigger = false;

        if(!itemsLength) throw new Error('选项条目数不能为空');

        if(option.isTauchDrag) {       //模拟拖动效果
            var originPos = null,
                currentPos = null;
            this.on(eventName.start, option.itemsWrapSelector, function(e){
                if(option.animateClass) itemWrap.removeClass(option.animateClass).offset();
                originPos = getCoord(e);
                var scrollX = getCurrentScroll(itemWrap);
                originPos.x -= scrollX;
                $document.on(eventName.move, move);
                $document.on(eventName.end, end);
            });


            /**
             * 拖动过程中触发的事件
             * @param e
             */
            function move(e){
                if(!originPos) end();
                checkisTrigger = true;
                e.preventDefault();
                currentPos = getCoord(e);
                var calc = calcCoord(currentPos, originPos);
                setPosition(itemWrap, calc, limit);
            }

            /**
             * 当拖动结束后触发的事件
             * @param e
             */
            function end(e){
                if(e && originPos && checkisTrigger) {
                    var calc = calcCoord(getCoord(e), originPos);
                    setPosition(itemWrap, calc, limit);
                }
                if(option.animateClass) itemWrap.addClass(option.animateClass);
                //重置数据
                originPos = null;
                currentPos = null;
                $document.off(eventName.move, move);
                $document.off(eventName.end, end);
                w.setTimeout(function(){
                    checkisTrigger = false;
                });
            }
        }

        //实现点击后，目标位置被选中
        this.on(eventName.click,option.itemsSelector,function(e){
            if(checkisTrigger) return;
            itemWrap.addClass(option.animateClass);
            $target = $(e.currentTarget);
            if(!$target.hasClass(option.selectClassName)) {
                items.removeClass(option.selectClassName);
                $target.addClass(option.selectClassName);

                var index = items.index($target),
                    baseOffset = itemWrap.get(0).getBoundingClientRect(),
                    offset = $target.get(0).getBoundingClientRect(),
                    width = offset.right - offset.left,
                    wWidth = $(window).width();
                var centerItem = offset.left  + width /2;
                var climit = [option.autoScrollCenter + width/2, wWidth - option.autoScrollCenter - width/2];
                if(centerItem < climit[0] || centerItem  > climit[1]) {
                    var tX = centerItem - baseOffset.left;
                    tX = wWidth/2  - tX;
                    setPosition(itemWrap,{dx:tX}, limit);
                }

                //判断位置，根据位置来滑动到中间位置
                if(typeof option.selectCallBack === 'function') {
                    option.selectCallBack.apply($target,[e, index]);
                }
            }
        });


        this.setIndex = function(index) {
            if(typeof index === 'number') items.eq(index).trigger(eventName.click);
            return this;
        };

        this.setIndex(option.currentIndex);

        return this;
    };

    $.fn.MenuScrollPlugin.defaults = {
        currentIndex: '',          //初始化时选中的项，处理默认选中项
        selectCallBack: '',       //点中某一项时的回调函数
        selectClassName: 'ac',     //标识当前选中项的类名
        isTauchDrag: true,          //是否开启手动拖动功能
        itemsSelector: 'li',        //条目选择器名称
        itemsWrapSelector: 'ul',     //父类选择器名称
        autoCheckMobile: true,       //是否自动检测设备是否支持touch事件，主要用来处理事件绑定
        animateClass: 'animate',     //
        autoScrollCenter: 80        //距离最近边最短距离，当小于这个距离时，才会自动滚动到中间
    };
})(Zepto, window);