if(typeof Shadowbox=="undefined"){throw"Unable to load Shadowbox, no base library adapter found."}(function(){var version="1.0";var options={assetURL:"",loadingImage:"/siteart/loading.gif",animate:true,animSequence:"wh",flvPlayer:"/siteart/flvplayer.swf",overlayColor:"#000",overlayOpacity:0.85,overlayBgImage:"/siteart/overlay-85.png",listenOverlay:true,autoplayMovies:true,showMovieControls:true,resizeDuration:0.35,fadeDuration:0.35,displayNav:true,continuous:false,displayCounter:true,counterType:"default",viewportPadding:20,handleLgImages:"resize",initialHeight:160,initialWidth:320,enableKeys:true,keysClose:["c","q",27],keysNext:["n",39],keysPrev:["p",37],onOpen:null,onFinish:null,onChange:null,onClose:null,handleUnsupported:"link",skipSetup:false,text:{cancel:"Cancel",loading:"loading",close:'<span class="shortcut">C</span>lose',next:'<span class="shortcut">N</span>ext',prev:'<span class="shortcut">P</span>revious',errors:{single:'You must install the <a href="{0}">{1}</a> browser plugin to view this content.',shared:'You must install both the <a href="{0}">{1}</a> and <a href="{2}">{3}</a> browser plugins to view this content.',either:'You must install either the <a href="{0}">{1}</a> or the <a href="{2}">{3}</a> browser plugin to view this content.'}},errors:{fla:{name:"Flash",url:"http://www.adobe.com/products/flashplayer/"},qt:{name:"QuickTime",url:"http://www.apple.com/quicktime/download/"},wmp:{name:"Windows Media Player",url:"http://www.microsoft.com/windows/windowsmedia/"},f4m:{name:"Flip4Mac",url:"http://www.flip4mac.com/wmv_download.htm"}},skin:{main:'<div id="shadowbox_overlay"></div><div id="shadowbox_container"><div id="shadowbox"><div id="shadowbox_body"><div id="shadowbox_body_inner"></div><div id="shadowbox_loading"></div></div><div id="shadowbox_title"><div id="shadowbox_title_inner"></div></div><div id="shadowbox_toolbar"><div id="shadowbox_toolbar_inner"></div></div></div></div>',loading:'<img src="{0}" alt="{1}" /><span><a href="javascript:Shadowbox.close();">{2}</a></span>',counter:'<div id="shadowbox_counter">{0}</div>',close:'<div id="shadowbox_nav_close"><a href="javascript:Shadowbox.close();">{0}</a></div>',next:'<div id="shadowbox_nav_next"><a href="javascript:Shadowbox.next();">{0}</a></div>',prev:'<div id="shadowbox_nav_previous"><a href="javascript:Shadowbox.previous();">{0}</a></div>'},ext:{img:["png","jpg","jpeg","gif","bmp"],qt:["dv","mov","moov","movie","mp4"],wmp:["asf","wm","wmv"],qtwmp:["avi","mpg","mpeg"],iframe:["asp","aspx","cgi","cfm","htm","html","pl","php","php3","php4","php5","phtml","rb","rhtml","shtml","txt","vbs"]}};var default_options=null;var SL=Shadowbox.lib;var RE={resize:/(img|swf|flv)/,overlay:/(img|iframe|html|inline)/,swf:/\.swf\s*$/i,flv:/\.flv\s*$/i,domain:/:\/\/(.*?)[:\/]/,inline:/#(.+)$/,rel:/^(light|shadow)box/i,gallery:/^(light|shadow)box\[(.*?)\]/i,unsupported:/^unsupported-(\w+)/,param:/\s*([a-z_]*?)\s*=\s*(.+)\s*/,empty:/^(?:br|frame|hr|img|input|link|meta|range|spacer|wbr|area|param|col)$/i};var cache=[];var current_gallery;var current;var optimal_height=options.initialHeight;var optimal_width=options.initialWidth;var current_height=0;var current_width=0;var preloader;var initialized=false;var activated=false;var drag;var draggable;var overlay_img_needed;var ua=navigator.userAgent.toLowerCase();var isStrict=document.compatMode=="CSS1Compat",isOpera=ua.indexOf("opera")>-1,isIE=ua.indexOf("msie")>-1,isIE7=ua.indexOf("msie 7")>-1,isBorderBox=isIE&&!isStrict,isSafari=(/webkit|khtml/).test(ua),isSafari3=isSafari&&!!(document.evaluate),isGecko=!isSafari&&ua.indexOf("gecko")>-1,isWindows=(ua.indexOf("windows")!=-1||ua.indexOf("win32")!=-1),isMac=(ua.indexOf("macintosh")!=-1||ua.indexOf("mac os x")!=-1),isLinux=(ua.indexOf("linux")!=-1);var absolute_pos=isIE&&!isIE7;var plugins=null;if(navigator.plugins&&navigator.plugins.length){var detectPlugin=function(plugin_name){var detected=false;for(var i=0,len=navigator.plugins.length;i<len;++i){if(navigator.plugins[i].name.indexOf(plugin_name)>-1){detected=true;break}}return detected};var f4m=detectPlugin("Flip4Mac");var plugins={fla:detectPlugin("Shockwave Flash"),qt:detectPlugin("QuickTime"),wmp:!f4m&&detectPlugin("Windows Media"),f4m:f4m}}else{var detectPlugin=function(plugin_name){var detected=false;try{var axo=new ActiveXObject(plugin_name);if(axo){detected=true}}catch(e){}return detected};var plugins={fla:detectPlugin("ShockwaveFlash.ShockwaveFlash"),qt:detectPlugin("QuickTime.QuickTime"),wmp:detectPlugin("wmplayer.ocx"),f4m:false}}var apply=function(o,e){for(var p in e){o[p]=e[p]}return o};var isLink=function(el){return typeof el.tagName=="string"&&(el.tagName.toUpperCase()=="A"||el.tagName.toUpperCase()=="AREA")};SL.getViewportHeight=function(){var height=window.innerHeight;var mode=document.compatMode;if((mode||isIE)&&!isOpera){height=isStrict?document.documentElement.clientHeight:document.body.clientHeight}return height};SL.getViewportWidth=function(){var width=window.innerWidth;var mode=document.compatMode;if(mode||isIE){width=isStrict?document.documentElement.clientWidth:document.body.clientWidth}return width};SL.getDocumentHeight=function(){var scrollHeight=isStrict?document.documentElement.scrollHeight:document.body.scrollHeight;return Math.max(scrollHeight,SL.getViewportHeight())};SL.getDocumentWidth=function(){var scrollWidth=isStrict?document.documentElement.scrollWidth:document.body.scrollWidth;return Math.max(scrollWidth,SL.getViewportWidth())};var clearOpacity=function(el){if(isIE){if(typeof el.style.filter=="string"&&(/alpha/i).test(el.style.filter)){el.style.filter=""}}else{el.style.opacity="";el.style["-moz-opacity"]="";el.style["-khtml-opacity"]=""}};var fadeIn=function(el,endingOpacity,duration,callback){if(options.animate){SL.setStyle(el,"opacity",0);el.style.visibility="visible";SL.animate(el,{opacity:{to:endingOpacity}},duration,function(){if(endingOpacity==1){clearOpacity(el)}if(typeof callback=="function"){callback()}})}else{if(endingOpacity==1){clearOpacity(el)}else{SL.setStyle(el,"opacity",endingOpacity)}el.style.visibility="visible";if(typeof callback=="function"){callback()}}};var fadeOut=function(el,duration,callback){var cb=function(){el.style.visibility="hidden";clearOpacity(el);if(typeof callback=="function"){callback()}};if(options.animate){SL.animate(el,{opacity:{to:0}},duration,cb)}else{cb()}};var appendHTML=function(el,html){el=SL.get(el);if(el.insertAdjacentHTML){el.insertAdjacentHTML("BeforeEnd",html);return el.lastChild}if(el.lastChild){var range=el.ownerDocument.createRange();range.setStartAfter(el.lastChild);var frag=range.createContextualFragment(html);el.appendChild(frag);return el.lastChild}else{el.innerHTML=html;return el.lastChild}};var overwriteHTML=function(el,html){el=SL.get(el);el.innerHTML=html;return el.firstChild};var getComputedHeight=function(el){var h=Math.max(el.offsetHeight,el.clientHeight);if(!h){h=parseInt(SL.getStyle(el,"height"),10)||0;if(!isBorderBox){h+=parseInt(SL.getStyle(el,"padding-top"),10)+parseInt(SL.getStyle(el,"padding-bottom"),10)+parseInt(SL.getStyle(el,"border-top-width"),10)+parseInt(SL.getStyle(el,"border-bottom-width"),10)}}return h};var getComputedWidth=function(el){var w=Math.max(el.offsetWidth,el.clientWidth);if(!w){w=parseInt(SL.getStyle(el,"width"),10)||0;if(!isBorderBox){w+=parseInt(SL.getStyle(el,"padding-left"),10)+parseInt(SL.getStyle(el,"padding-right"),10)+parseInt(SL.getStyle(el,"border-left-width"),10)+parseInt(SL.getStyle(el,"border-right-width"),10)}}return w};var getPlayerType=function(url){if(RE.img.test(url)){return"img"}var match=url.match(RE.domain);var this_domain=match?document.domain==match[1]:false;if(url.indexOf("#")>-1&&this_domain){return"inline"}var q_index=url.indexOf("?");if(q_index>-1){url=url.substring(0,q_index)}if(RE.swf.test(url)){return plugins.fla?"swf":"unsupported-swf"}if(RE.flv.test(url)){return plugins.fla?"flv":"unsupported-flv"}if(RE.qt.test(url)){return plugins.qt?"qt":"unsupported-qt"}if(RE.wmp.test(url)){if(plugins.wmp){return"wmp"}else{if(plugins.f4m){return"qt"}else{return isMac?(plugins.qt?"unsupported-f4m":"unsupported-qtf4m"):"unsupported-wmp"}}}else{if(RE.qtwmp.test(url)){if(plugins.qt){return"qt"}else{if(plugins.wmp){return"wmp"}else{return isMac?"unsupported-qt":"unsupported-qtwmp"}}}else{if(!this_domain||RE.iframe.test(url)){return"iframe"}}}return"unsupported"};var handleClick=function(ev){var link;if(isLink(this)){link=this}else{link=SL.getTarget(ev);while(!isLink(link)&&link.parentNode){link=link.parentNode}}Shadowbox.open(link);if(current_gallery.length){SL.preventDefault(ev)}};var setupGallery=function(obj){var copy=apply({},obj);if(!obj.gallery){current_gallery=[copy];current=0}else{current_gallery=[];var index,ci;for(var i=0,len=cache.length;i<len;++i){ci=cache[i];if(ci.gallery){if(ci.content==obj.content&&ci.gallery==obj.gallery&&ci.title==obj.title){index=current_gallery.length}if(ci.gallery==obj.gallery){current_gallery.push(apply({},ci))}}}if(index==null){current_gallery.unshift(copy);index=0}current=index}var match,r;for(var i=0,len=current_gallery.length;i<len;++i){r=false;if(current_gallery[i].type=="unsupported"){r=true}else{if(match=RE.unsupported.exec(current_gallery[i].type)){if(options.handleUnsupported=="link"){current_gallery[i].type="html";var m;switch(match[1]){case"qtwmp":m=String.format(options.text.errors.either,options.errors.qt.url,options.errors.qt.name,options.errors.wmp.url,options.errors.wmp.name);break;case"qtf4m":m=String.format(options.text.errors.shared,options.errors.qt.url,options.errors.qt.name,options.errors.f4m.url,options.errors.f4m.name);break;default:if(match[1]=="swf"||match[1]=="flv"){match[1]="fla"}m=String.format(options.text.errors.single,options.errors[match[1]].url,options.errors[match[1]].name)}current_gallery[i]=apply(current_gallery[i],{height:160,width:320,content:'<div class="shadowbox_message">'+m+"</div>"})}else{r=true}}else{if(current_gallery[i].type=="inline"){var match=RE.inline.exec(current_gallery[i].content);if(match){var el;if(el=SL.get(match[1])){current_gallery[i].content=el.innerHTML}else{throw"No element found with id "+match[1]}}else{throw"No element id found for inline content"}}}}if(r){current_gallery.splice(i,1);if(i<current){--current}--i}}};var buildBars=function(){var link=current_gallery[current];if(!link){return }var title_i=SL.get("shadowbox_title_inner");title_i.innerHTML=(link.title)?link.title:"";var tool_i=SL.get("shadowbox_toolbar_inner");tool_i.innerHTML="";if(options.displayNav){tool_i.innerHTML=String.format(options.skin.close,options.text.close);if(current_gallery.length>1){if(options.continuous){appendHTML(tool_i,String.format(options.skin.next,options.text.next));appendHTML(tool_i,String.format(options.skin.prev,options.text.prev))}else{if((current_gallery.length-1)>current){appendHTML(tool_i,String.format(options.skin.next,options.text.next))}if(current>0){appendHTML(tool_i,String.format(options.skin.prev,options.text.prev))}}}}if(current_gallery.length>1&&options.displayCounter){var counter="";if(options.counterType=="skip"){for(var i=0,len=current_gallery.length;i<len;++i){counter+='<a href="javascript:Shadowbox.change('+i+');"';if(i==current){counter+=' class="shadowbox_counter_current"'}counter+=">"+(i+1)+"</a>"}}else{counter=(current+1)+" of "+current_gallery.length}appendHTML(tool_i,String.format(options.skin.counter,counter))}};var hideBars=function(callback){var title_m=getComputedHeight(SL.get("shadowbox_title"));var tool_m=0-getComputedHeight(SL.get("shadowbox_toolbar"));var title_i=SL.get("shadowbox_title_inner");var tool_i=SL.get("shadowbox_toolbar_inner");if(options.animate&&callback){SL.animate(title_i,{marginTop:{to:title_m}},0.2);SL.animate(tool_i,{marginTop:{to:tool_m}},0.2,callback)}else{SL.setStyle(title_i,"marginTop",title_m+"px");SL.setStyle(tool_i,"marginTop",tool_m+"px")}};var showBars=function(callback){var title_i=SL.get("shadowbox_title_inner");if(options.animate){if(title_i.innerHTML!=""){SL.animate(title_i,{marginTop:{to:0}},0.35)}SL.animate(SL.get("shadowbox_toolbar_inner"),{marginTop:{to:0}},0.35,callback)}else{if(title_i.innerHTML!=""){SL.setStyle(title_i,"margin-top","0px")}SL.setStyle(SL.get("shadowbox_toolbar_inner"),"margin-top","0px");callback()}};var resetDrag=function(){drag={x:0,y:0,start_x:null,start_y:null}};var toggleDrag=function(on){if(on){resetDrag();var styles=["position:absolute","cursor:"+(isGecko?"-moz-grab":"move")];styles.push(isIE?"background-color:#fff;filter:alpha(opacity=0)":"background-color:transparent");appendHTML("shadowbox_body_inner",'<div id="shadowbox_drag_layer" style="'+styles.join(";")+'"></div>');SL.addEvent(SL.get("shadowbox_drag_layer"),"mousedown",listenDrag)}else{var d=SL.get("shadowbox_drag_layer");if(d){SL.removeEvent(d,"mousedown",listenDrag);SL.remove(d)}}};var listenDrag=function(ev){drag.start_x=ev.clientX;drag.start_y=ev.clientY;draggable=SL.get("shadowbox_content");SL.addEvent(document,"mousemove",positionDrag);SL.addEvent(document,"mouseup",unlistenDrag);if(isGecko){SL.setStyle(SL.get("shadowbox_drag_layer"),"cursor","-moz-grabbing")}};var unlistenDrag=function(){SL.removeEvent(document,"mousemove",positionDrag);SL.removeEvent(document,"mouseup",unlistenDrag);if(isGecko){SL.setStyle(SL.get("shadowbox_drag_layer"),"cursor","-moz-grab")}};var positionDrag=function(ev){var move_y=ev.clientY-drag.start_y;drag.start_y=drag.start_y+move_y;drag.y=Math.max(Math.min(0,drag.y+move_y),current_height-optimal_height);SL.setStyle(draggable,"top",drag.y+"px");var move_x=ev.clientX-drag.start_x;drag.start_x=drag.start_x+move_x;drag.x=Math.max(Math.min(0,drag.x+move_x),current_width-optimal_width);SL.setStyle(draggable,"left",drag.x+"px")};var loadContent=function(){var obj=current_gallery[current];if(!obj){return }buildBars();switch(obj.type){case"img":preloader=new Image();preloader.onload=function(){var h=obj.height?parseInt(obj.height,10):preloader.height;var w=obj.width?parseInt(obj.width,10):preloader.width;resizeContent(h,w,function(dims){showBars(function(){setContent({tag:"img",height:dims.i_height,width:dims.i_width,src:obj.content,style:"position:absolute"});if(dims.enableDrag&&options.handleLgImages=="drag"){toggleDrag(true);SL.setStyle(SL.get("shadowbox_drag_layer"),{height:dims.i_height+"px",width:dims.i_width+"px"})}finishContent()})});preloader.onload=function(){}};preloader.src=obj.content;break;case"swf":case"flv":case"qt":case"wmp":var markup=Shadowbox.movieMarkup(obj);resizeContent(markup.height,markup.width,function(){showBars(function(){setContent(markup);finishContent()})});break;case"iframe":var h=obj.height?parseInt(obj.height,10):SL.getViewportHeight();var w=obj.width?parseInt(obj.width,10):SL.getViewportWidth();var content={tag:"iframe",name:"shadowbox_content",height:"100%",width:"100%",frameborder:"0",marginwidth:"0",marginheight:"0",scrolling:"auto"};resizeContent(h,w,function(dims){showBars(function(){setContent(content);var win=(isIE)?SL.get("shadowbox_content").contentWindow:window.frames["shadowbox_content"];win.location=obj.content;finishContent()})});break;case"html":case"inline":var h=obj.height?parseInt(obj.height,10):SL.getViewportHeight();var w=obj.width?parseInt(obj.width,10):SL.getViewportWidth();var content={tag:"div",cls:"html",html:obj.content};resizeContent(h,w,function(){showBars(function(){setContent(content);finishContent()})});break;default:throw"Shadowbox cannot open content of type "+obj.type}if(current_gallery.length>0){var next=current_gallery[current+1];if(!next){next=current_gallery[0]}if(next.type=="img"){var preload_next=new Image();preload_next.src=next.href}var prev=current_gallery[current-1];if(!prev){prev=current_gallery[current_gallery.length-1]}if(prev.type=="img"){var preload_prev=new Image();preload_prev.src=prev.href}}};var setContent=function(obj){var id="shadowbox_content";var content=SL.get(id);if(content){switch(content.tagName.toUpperCase()){case"OBJECT":var link=current_gallery[(obj?current-1:current)];if(link.type=="wmp"&&isIE){try{shadowbox_content.controls.stop();shadowbox_content.URL="non-existent.wmv";window.shadowbox_content=function(){}}catch(e){}}else{if(link.type=="qt"&&isSafari){try{document.shadowbox_content.Stop()}catch(e){}content.innerHTML=""}}setTimeout(function(){SL.remove(content)},10);break;case"IFRAME":SL.remove(content);if(isGecko){delete window.frames[id]}break;default:SL.remove(content)}}if(obj){if(!obj.id){obj.id=id}return appendHTML("shadowbox_body_inner",Shadowbox.createHTML(obj))}return null};var finishContent=function(){var obj=current_gallery[current];if(!obj){return }hideLoading(function(){listenKeyboard(true);if(options.onFinish&&typeof options.onFinish=="function"){options.onFinish(obj)}})};var resizeContent=function(height,width,callback){optimal_height=height;optimal_width=width;var resizable=RE.resize.test(current_gallery[current].type);var dims=getDimensions(optimal_height,optimal_width,resizable);if(callback){var cb=function(){callback(dims)};switch(options.animSequence){case"hw":adjustHeight(dims.height,dims.top,true,function(){adjustWidth(dims.width,true,cb)});break;case"wh":adjustWidth(dims.width,true,function(){adjustHeight(dims.height,dims.top,true,cb)});break;default:adjustWidth(dims.width,true);adjustHeight(dims.height,dims.top,true,cb)}}else{adjustWidth(dims.width,false);adjustHeight(dims.height,dims.top,false);if(options.handleLgImages=="resize"&&resizable){var content=SL.get("shadowbox_content");if(content){content.height=dims.i_height;content.width=dims.i_width}}}};var getDimensions=function(o_height,o_width,resizable){if(typeof resizable=="undefined"){resizable=false}var height=o_height=parseInt(o_height);var width=o_width=parseInt(o_width);var shadowbox_b=SL.get("shadowbox_body");var view_height=SL.getViewportHeight();var extra_height=parseInt(SL.getStyle(shadowbox_b,"border-top-width"),10)+parseInt(SL.getStyle(shadowbox_b,"border-bottom-width"),10)+parseInt(SL.getStyle(shadowbox_b,"margin-top"),10)+parseInt(SL.getStyle(shadowbox_b,"margin-bottom"),10)+getComputedHeight(SL.get("shadowbox_title"))+getComputedHeight(SL.get("shadowbox_toolbar"))+(2*options.viewportPadding);if((height+extra_height)>=view_height){height=view_height-extra_height}var view_width=SL.getViewportWidth();var extra_body_width=parseInt(SL.getStyle(shadowbox_b,"border-left-width"),10)+parseInt(SL.getStyle(shadowbox_b,"border-right-width"),10)+parseInt(SL.getStyle(shadowbox_b,"margin-left"),10)+parseInt(SL.getStyle(shadowbox_b,"margin-right"),10);var extra_width=extra_body_width+(2*options.viewportPadding);if((width+extra_width)>=view_width){width=view_width-extra_width}var enableDrag=false;var i_height=o_height;var i_width=o_width;var handle=options.handleLgImages;if(resizable&&(handle=="resize"||handle=="drag")){var change_h=(o_height-height)/o_height;var change_w=(o_width-width)/o_width;if(handle=="resize"){if(change_h>change_w){width=Math.round((o_width/o_height)*height)}else{if(change_w>change_h){height=Math.round((o_height/o_width)*width)}}i_width=width;i_height=height}else{var link=current_gallery[current];if(link){enableDrag=link.type=="img"&&(change_h>0||change_w>0)}}}return{height:height,width:width+extra_body_width,i_height:i_height,i_width:i_width,top:((view_height-(height+extra_height))/2)+options.viewportPadding,enableDrag:enableDrag}};var centerVertically=function(){var shadowbox=SL.get("shadowbox");var scroll=document.documentElement.scrollTop;var s_top=scroll+Math.round((SL.getViewportHeight()-(shadowbox.offsetHeight||0))/2);SL.setStyle(shadowbox,"top",s_top+"px")};var adjustHeight=function(height,top,animate,callback){height=parseInt(height);current_height=height;var sbi=SL.get("shadowbox_body_inner");if(animate&&options.animate){SL.animate(sbi,{height:{to:height}},options.resizeDuration,callback)}else{SL.setStyle(sbi,"height",height+"px");if(typeof callback=="function"){callback()}}if(absolute_pos){centerVertically();SL.addEvent(window,"scroll",centerVertically);top+=document.documentElement.scrollTop}var shadowbox=SL.get("shadowbox");if(animate&&options.animate){SL.animate(shadowbox,{top:{to:top}},options.resizeDuration)}else{SL.setStyle(shadowbox,"top",top+"px")}};var adjustWidth=function(width,animate,callback){width=parseInt(width);current_width=width;var shadowbox=SL.get("shadowbox");if(animate&&options.animate){SL.animate(shadowbox,{width:{to:width}},options.resizeDuration,callback)}else{SL.setStyle(shadowbox,"width",width+"px");if(typeof callback=="function"){callback()}}};var listenKeyboard=function(on){if(!options.enableKeys){return }if(on){document.onkeydown=handleKey}else{document.onkeydown=""}};var assertKey=function(valid,key,code){return(valid.indexOf(key)!=-1||valid.indexOf(code)!=-1)};var handleKey=function(e){var code=e?e.which:event.keyCode;var key=String.fromCharCode(code).toLowerCase();if(assertKey(options.keysClose,key,code)){Shadowbox.close()}else{if(assertKey(options.keysPrev,key,code)){Shadowbox.previous()}else{if(assertKey(options.keysNext,key,code)){Shadowbox.next()}}}};var toggleTroubleElements=function(on){var vis=(on?"visible":"hidden");var selects=document.getElementsByTagName("select");for(i=0,len=selects.length;i<len;++i){selects[i].style.visibility=vis}var objects=document.getElementsByTagName("object");for(i=0,len=objects.length;i<len;++i){objects[i].style.visibility=vis}var embeds=document.getElementsByTagName("embed");for(i=0,len=embeds.length;i<len;++i){embeds[i].style.visibility=vis}};var showLoading=function(){var loading=SL.get("shadowbox_loading");overwriteHTML(loading,String.format(options.skin.loading,options.assetURL+options.loadingImage,options.text.loading,options.text.cancel));loading.style.visibility="visible"};var hideLoading=function(callback){var t=current_gallery[current].type;var anim=(t=="img"||t=="html");var loading=SL.get("shadowbox_loading");if(anim){fadeOut(loading,0.35,callback)}else{loading.style.visibility="hidden";callback()}};var resizeOverlay=function(){var overlay=SL.get("shadowbox_overlay");SL.setStyle(overlay,{height:"100%",width:"100%"});SL.setStyle(overlay,"height",SL.getDocumentHeight()+"px");if(!isSafari3){SL.setStyle(overlay,"width",SL.getDocumentWidth()+"px")}};var checkOverlayImgNeeded=function(){if(!(isGecko&&isMac)){return false}for(var i=0,len=current_gallery.length;i<len;++i){if(!RE.overlay.exec(current_gallery[i].type)){return true}}return false};var toggleOverlay=function(callback){var overlay=SL.get("shadowbox_overlay");if(overlay_img_needed==null){overlay_img_needed=checkOverlayImgNeeded()}if(callback){resizeOverlay();if(overlay_img_needed){SL.setStyle(overlay,{visibility:"visible",backgroundColor:"transparent",backgroundImage:"url("+options.assetURL+options.overlayBgImage+")",backgroundRepeat:"repeat",opacity:1});callback()}else{SL.setStyle(overlay,{visibility:"visible",backgroundColor:options.overlayColor,backgroundImage:"none"});fadeIn(overlay,options.overlayOpacity,options.fadeDuration,callback)}}else{if(overlay_img_needed){SL.setStyle(overlay,"visibility","hidden")}else{fadeOut(overlay,options.fadeDuration)}overlay_img_needed=null}};Shadowbox.init=function(opts){if(initialized){return }options=apply(options,opts||{});appendHTML(document.body,options.skin.main);RE.img=new RegExp(".("+options.ext.img.join("|")+")s*$","i");RE.qt=new RegExp(".("+options.ext.qt.join("|")+")s*$","i");RE.wmp=new RegExp(".("+options.ext.wmp.join("|")+")s*$","i");RE.qtwmp=new RegExp(".("+options.ext.qtwmp.join("|")+")s*$","i");RE.iframe=new RegExp(".("+options.ext.iframe.join("|")+")s*$","i");var id=null;var resize=function(){clearInterval(id);id=null;resizeOverlay();resizeContent(optimal_height,optimal_width)};SL.addEvent(window,"resize",function(){if(activated){if(id){clearInterval(id);id=null}if(!id){id=setInterval(resize,50)}}});if(options.listenOverlay){SL.addEvent(SL.get("shadowbox_overlay"),"click",Shadowbox.close)}if(absolute_pos){SL.setStyle(SL.get("shadowbox_container"),"position","absolute");SL.setStyle("shadowbox_body","zoom",1);SL.addEvent(SL.get("shadowbox_container"),"click",function(e){var target=SL.getTarget(e);if(target.id&&target.id=="shadowbox_container"){Shadowbox.close()}})}if(!options.skipSetup){Shadowbox.setup()}initialized=true};Shadowbox.setup=function(links,opts){if(!links){var links=[];var a=document.getElementsByTagName("a"),rel;for(var i=0,len=a.length;i<len;++i){rel=a[i].getAttribute("rel");if(rel&&RE.rel.test(rel)){links[links.length]=a[i]}}}else{if(!links.length){links=[links]}}var link;for(var i=0,len=links.length;i<len;++i){link=links[i];if(typeof link.shadowboxCacheKey=="undefined"){link.shadowboxCacheKey=cache.length;SL.addEvent(link,"click",handleClick)}cache[link.shadowboxCacheKey]=this.buildCacheObj(link,opts)}};Shadowbox.buildCacheObj=function(link,opts){var href=link.href;var o={el:link,title:link.getAttribute("title"),type:getPlayerType(href),options:apply({},opts||{}),content:href};var opt,l_opts=["title","type","height","width","gallery"];for(var i=0,len=l_opts.length;i<len;++i){opt=l_opts[i];if(typeof o.options[opt]!="undefined"){o[opt]=o.options[opt];delete o.options[opt]}}var rel=link.getAttribute("rel");if(rel){var match=rel.match(RE.gallery);if(match){o.gallery=escape(match[2])}var params=rel.split(";");for(var i=0,len=params.length;i<len;++i){match=params[i].match(RE.param);if(match){if(match[1]=="options"){eval("o.options = apply(o.options, "+match[2]+")")}else{o[match[1]]=match[2]}}}}return o};Shadowbox.applyOptions=function(opts){if(opts){default_options=apply({},options);options=apply(options,opts)}};Shadowbox.revertOptions=function(){if(default_options){options=default_options;default_options=null}};Shadowbox.open=function(obj,opts){if(activated){return }activated=true;if(isLink(obj)){if(typeof obj.shadowboxCacheKey=="undefined"||typeof cache[obj.shadowboxCacheKey]=="undefined"){obj=this.buildCacheObj(obj,opts)}else{obj=cache[obj.shadowboxCacheKey]}}this.revertOptions();if(obj.options||opts){this.applyOptions(apply(apply({},obj.options||{}),opts||{}))}setupGallery(obj);if(current_gallery.length){if(options.onOpen&&typeof options.onOpen=="function"){options.onOpen(obj)}SL.setStyle(SL.get("shadowbox"),"display","block");toggleTroubleElements(false);var dims=getDimensions(options.initialHeight,options.initialWidth);adjustHeight(dims.height,dims.top);adjustWidth(dims.width);hideBars(false);toggleOverlay(function(){SL.setStyle(SL.get("shadowbox"),"visibility","visible");showLoading();loadContent()})}};Shadowbox.change=function(num){if(!current_gallery){return }if(!current_gallery[num]){if(!options.continuous){return }else{num=(num<0)?(current_gallery.length-1):0}}current=num;toggleDrag(false);setContent(null);listenKeyboard(false);if(options.onChange&&typeof options.onChange=="function"){options.onChange(current_gallery[current])}showLoading();hideBars(loadContent)};Shadowbox.next=function(){return this.change(current+1)};Shadowbox.previous=function(){return this.change(current-1)};Shadowbox.close=function(){if(!activated){return }listenKeyboard(false);SL.setStyle(SL.get("shadowbox"),{display:"none",visibility:"hidden"});if(absolute_pos){SL.removeEvent(window,"scroll",centerVertically)}toggleDrag(false);setContent(null);if(preloader){preloader.onload=function(){};preloader=null}toggleOverlay(false);toggleTroubleElements(true);if(options.onClose&&typeof options.onClose=="function"){options.onClose(current_gallery[current])}activated=false};Shadowbox.clearCache=function(){for(var i=0,len=cache.length;i<len;++i){if(cache[i].el){SL.removeEvent(cache[i].el,"click",handleClick);delete cache[i].shadowboxCacheKey}}cache=[]};Shadowbox.movieMarkup=function(obj){var h=obj.height?parseInt(obj.height,10):300;var w=obj.width?parseInt(obj.width,10):300;var autoplay=options.autoplayMovies;var controls=options.showMovieControls;if(obj.options){if(obj.options.autoplayMovies!=null){autoplay=obj.options.autoplayMovies}if(obj.options.showMovieControls!=null){controls=obj.options.showMovieControls}}var markup={tag:"object",name:"shadowbox_content"};switch(obj.type){case"swf":var dims=getDimensions(h,w,true);h=dims.height;w=dims.width;markup.type="application/x-shockwave-flash";markup.data=obj.content;markup.children=[{tag:"param",name:"movie",value:obj.content}];break;case"flv":autoplay=autoplay?"true":"false";var showicons="false";var a=h/w;if(controls){showicons="true";h+=20}var dims=getDimensions(h,h/a,true);h=dims.height;w=(h-(controls?20:0))/a;var flashvars=["file="+obj.content,"height="+h,"width="+w,"autostart="+autoplay,"displayheight="+(h-(controls?20:0)),"showicons="+showicons,"backcolor=0x000000&amp;frontcolor=0xCCCCCC&amp;lightcolor=0x557722"];markup.type="application/x-shockwave-flash";markup.data=options.assetURL+options.flvPlayer;markup.children=[{tag:"param",name:"movie",value:options.assetURL+options.flvPlayer},{tag:"param",name:"flashvars",value:flashvars.join("&amp;")},{tag:"param",name:"allowfullscreen",value:"true"}];break;case"qt":autoplay=autoplay?"true":"false";if(controls){controls="true";h+=16}else{controls="false"}markup.children=[{tag:"param",name:"src",value:obj.content},{tag:"param",name:"scale",value:"aspect"},{tag:"param",name:"controller",value:controls},{tag:"param",name:"autoplay",value:autoplay}];if(isIE){markup.classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";markup.codebase="http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0"}else{markup.type="video/quicktime";markup.data=obj.content}break;case"wmp":autoplay=autoplay?1:0;markup.children=[{tag:"param",name:"autostart",value:autoplay}];if(isIE){if(controls){controls="full";h+=70}else{controls="none"}markup.classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6";markup.children[markup.children.length]={tag:"param",name:"url",value:obj.content};markup.children[markup.children.length]={tag:"param",name:"uimode",value:controls}}else{if(controls){controls=1;h+=45}else{controls=0}markup.type="video/x-ms-wmv";markup.data=obj.content;markup.children[markup.children.length]={tag:"param",name:"showcontrols",value:controls}}break}markup.height=h;markup.width=w;return markup};Shadowbox.createHTML=function(obj){var html="<"+obj.tag;for(var attr in obj){if(attr=="tag"||attr=="html"||attr=="children"){continue}if(attr=="cls"){html+=' class="'+obj["cls"]+'"'}else{html+=" "+attr+'="'+obj[attr]+'"'}}if(RE.empty.test(obj.tag)){html+="/>\n"}else{html+=">\n";var cn=obj.children;if(cn){for(var i=0,len=cn.length;i<len;++i){html+=this.createHTML(cn[i])}}if(obj.html){html+=obj.html}html+="</"+obj.tag+">\n"}return html};Shadowbox.getPlugins=function(){return plugins};Shadowbox.getOptions=function(){return options};Shadowbox.getCurrent=function(){return current_gallery[current]};Shadowbox.getVersion=function(){return version}})();Array.prototype.indexOf=Array.prototype.indexOf||function(C){for(var B=0,A=this.length;B<A;++B){if(this[B]==C){return B}}return -1};String.format=String.format||function(B){var A=Array.prototype.slice.call(arguments,1);return B.replace(/\{(\d+)\}/g,function(C,D){return A[D]})}