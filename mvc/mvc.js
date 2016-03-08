
;(function(w,d,undefinde) {

    var _viewElement = null;
    var _defaultRoute = null;

    jsMvc = function(){
        this._routeMap = {};
    }

    var routeObj = function(c,r,t){
        this.controller = c;
        this.route = r;
        this.template = t;
    }

    jsMvc.prototype.addRoute = function(controller,route,template){
        this._routeMap[route] = new routeObj(controller,route,template);
    }
    jsMvc.prototype.Initialize = function(){
        var stratMvcDelegate = startMvc.bind(this);
        _viewElement = d.querySelector('[view]');
        if(!_viewElement) return;
        //get the first ele in this._routeMap
        _defaultRoute = this._routeMap[Object.getOwnPropertyNames(this._routeMap)[0]];

        w.onhashchange = stratMvcDelegate();
        stratMvcDelegate();
    }
    function loadTemplate(routeObject,view){
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }else{
            xmlhttp = new ActiveXObject('Microsoft.XMLHttpRequest');
        }
        xmlhttp.onreadystatechange = function(){
            if(xmlhttp.readyState ==4 && xmlhttp.status == 200){
                loadView(routeObject,view,xmlhttp.responseText);
            }
        }
        xmlhttp.open('GET',routeObject.template,true);
        xmlhttp.send();
    }

    function loadView(routeObject,viewElement,viewHtml){
        var model = {};
        routeObject.controller(model);
        viewHtml = replaceToken(viewHtml,model);
        viewElement.innerHTML = viewHtml;
    }

    function replaceToken(viewHtml,model){
        var modelProps = Object.getOwnPropertyNames(model);
        modelProps.forEach(function(element,index,array) {
            viewHtml = viewHtml.replace('{{' + element +'}}',model[element]);
        });
        return viewHtml;
    }

    function startMvc(){
        var pageHash = w.location.hash.replace('#','');
        var routeName = null;
        var routeObj = null;

        routeName = pageHash.replace('/','');
        routeObj = this._routeMap[routeName];
        if (!routeObj) {
            routeObj = _defaultRoute;
        };
        loadTemplate(routeObj,_viewElement.pageHash);
    }

    w['jsMvc'] = new jsMvc();

})(window,document,undefined);