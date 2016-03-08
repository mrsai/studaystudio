function view() {
    return {
        w: document.documentElement.clientWidth,
        h: document.documentElement.clientHeight
    };
}

function id(obj) {
    return document.getElementById(obj);
}

function bind(obj, evt, fn) {
    if (obj.addEventListener) {
        obj.addEventListener(evt, fn, false);
    } else {
        obj.attachEvent('on' + evt, function() {
            fn.call(obj);
        })
    }
}

function addClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = aClass.length - 1; i >= 0; i--) {
        if (aClass[i] === sClass) return;
    };
    obj.className += ' ' + sClass;
}

function removeClass(obj, sClass) {
    var aClass = obj.className.split(' ');
    if (!obj.className) return;

    for (var i = aClass.length - 1; i >= 0; i--) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join();
            break;
        }
    };
}

function fnLoad() {
    var iTime = Date.now();
    var oW = id('welcome');
    var arr = [""];
    var bImagLoad = true;
    var bTime = false;
    var oTimer = 0;

    bind(oW, 'webkitTransitionEnd', end);
    bind(oW, 'transitionend', end);

    oTimer = setInterval(function(argument) {
        if (Date.now() - iTime >= 5000) {
            bTime = true;
        };

        if (bImagLoad && bTime) {
            clearInterval(oTimer);

            oW.style.opacity = 0;
        }
    }, 1000);

    function end() {
        removeClass(oW, 'pageShow');
        fnTab();
    }
}

function fnTab() {
    var oTab = id("tabPic");
    var oList = id('picList');
    var oNav = oTab.getElementsByTagName('nav')[0].children;
    var iNow = 0;
    var iX = 0;
    var iW = view().w;
    var oTimer = 0;
    var iStartTouchX = 0;
    var iStartX = 0;

    bind(oTab, 'touchstart', fnStart);
    bind(oTab, 'touchmove', fnMove);
    bind(oTab, 'touchend', fnEnd);

    auto();
    if(!window.bFnScore){
        fnScore();
        window.bFnScore = true;
    }
    function auto() {
        oTimer = setInterval(function() {
            iNow++;
            iNow = iNow%oNav.length;
            tab();
        }, 2000)
    }

    function fnStart (evt) {
        oList.style.transition="none";
        evt = evt.changedTouches[0];
        iStartTouchX = evt.pageX;
        iStartX = iX;
        clearInterval(oTimer);
    }

    function fnMove (evt) {
        evt = evt.changedTouches[0];
        var iDis = evt.pageX - iStartTouchX;
        iX = iStartX + iDis;
        oList.style.WebkitTransform = oList.style.transform = 'translateX('+ iX +'px)';
    }

    function fnEnd () {
        iNow = iX/iW;
        iNow = - Math.round(iNow);
        if(iNow<0) {iNow = 0};
        if(iNow>oNav.length-1) {iNow = oNav.length - 1};
        tab();
        auto();
    }
    
    function tab()
    {
        iX=-iNow*iW;
        oList.style.transition="0.5s";
        oList.style.WebkitTransform=oList.style.transform="translateX("+iX+"px)";
        for(var i=0;i<oNav.length;i++)
        {
            removeClass(oNav[i],"active");
        }
        addClass(oNav[iNow],"active");
    }
}

function fnScore () {
    var oScore = id('score');
    var aLi = oScore.getElementsByTagName('li');

    for(var i=0;i<aLi.length;i++){
        fn(aLi[i]);
    }

    function fn (oLi) {
        var aNav = oLi.getElementsByTagName('a');
        var oInput = oLi.getElementsByTagName('input')[0];
        for(var i=0 ; i < aNav.length ; i++){
            aNav[i].index = i ;
            bind(aNav[i],'touchstart',function () {
                for(var j=0 ; j < aNav.length ; j++){
                    if(j<=this.index){
                        addClass(aNav[j],'active');
                    }else{
                        removeClass(aNav[j],'active');
                    }
                }
                oInput.value = this.index;
            });
        }
    }
    if(!window.bFnIndex){
        fnIndex();
        window.bFnIndex = true;
    }
}

function fnInfo(oInfo,sInfo){
    oInfo.innerHTML = sInfo;
    oInfo.style.WebkitTransform = 'scale(1)';
    oInfo.style.opacity = 1;

    setTimeout(function(){
        oInfo.style.WebkitTransform = 'scale(0)';
        oInfo.style.opacity = 0;
    },2000)
}

function fnIndex () {
    var oIndex = id('index');
    var oBtn = oIndex.getElementsByClassName('btn')[0];
    var oInfo = oIndex.getElementsByClassName('info')[0];
    var bScore = false;

    bind(oBtn,'touchend',fnEnd);

    function fnEnd(){
        bScore = fnScoreChecked();

        if(bScore){
            if(bTag()){
                fnIndexOut();
            }else{
                fnInfo(oInfo,'请给景区添加标签！');
            }
        }else{
            fnInfo(oInfo,'请给景区评分！');
        }
    }

    function fnScoreChecked(){
        var oScore = id('score');
        var aInput = oScore.getElementsByTagName('input');
        for(var i=0 ; i < aInput.length ; i++){
            if(aInput[i].value==-1){
                return false;
            }
        }
        return true;
    }

    function bTag(){
        var oTag = id("indexTag");
        var aInput = oTag.getElementsByTagName('input');
        for(var i=0 ; i < aInput.length ; i++){
            if(aInput[i].checked == true){
                return true;
            }
        }
        return false;
    }
}

function fnIndexOut(){
    var oMask = id('mask');
    var oIndex = id('index');
    var oNew = id('news');

    addClass(oMask,'pageShow');
    addClass(oNew,'pageShow');
    if(!window.bFnNews){
        fnNews();
        window.bFnNews = true;
    }
    setTimeout(function(){
        oMask.style.opacity = 1;
        oIndex.style.WebkitFilter = oIndex.style.filter = "blur(5px)";
    },14);

    setTimeout(function(){
        oNew.style.transition = '.5s';
        oMask.style.opacity = 0;
        oIndex.style.WebkitFilter = oIndex.style.filter = "blur(0px)";
        oNew.style.opacity = 1;
        removeClass(oMask,'pageShow');
    },3000)
}


 function fnNews(){
    var oNews = id('news');
    var oInfo = oNews.getElementsByClassName('info')[0];
    var aInput = oNews.getElementsByTagName('input');

    bind(aInput[0],'change',function(){
        if(this.files[0].type.split('/')[0]=='video'){
            fnNewsOut();
            this.value = '';
        }else{
            fnInfo(oInfo,'请上传视频');
        }
    });
    bind(aInput[1],'change',function(){
        if(this.files[0].type.split('/')[0]=='image'){
            fnNewsOut();
            this.value = '';
        }else{
            fnInfo(oInfo,'请上传图片');
        }
    })
 }

function fnNewsOut(){
    var oNews = id('news');
    var oForm = id('form');
    addClass(oForm,'pageShow');
    oNews.style.cssText = '';
    removeClass(oNews,'pageShow');
    if(!window.bFormIn){
        formIn();
        window.bFormIn = true;
    }
}

function formIn(){
    var oForm = id('form');
    var oOver = id('over');
    var oBtn=oForm.getElementsByClassName("btn")[0];
    var aFormTag = id('formTag').getElementsByTagName('label');
    var bOff = false;

    for(var i=0 ; i < aFormTag.length ; i++){
        bind(aFormTag[i],'touchend',function(){
            bOff = true;
            addClass(oBtn,'submit');
        })   
    }

    bind(oBtn,'touchend',function(){
        if(bOff){
            for(var i=0 ; i < aFormTag.length ; i++){
                aFormTag[i].getElementsByTagName('input')[0].checked = false;
            }
        }
        bOff = true;
        addClass(oOver,'pageShow');
        removeClass(oForm,'pageShow');
        removeClass(oBtn,'submit');
        if(!window.bOver){
            over();
            window.bOver = true;
        }
    })
}


function over () {
    var oOver = id('over');
    var oBtn = oOver.getElementsByClassName('btn')[0];
    bind(oBtn,'touchend',function () {
        removeClass(oOver,'pageShow');
    })
}
















