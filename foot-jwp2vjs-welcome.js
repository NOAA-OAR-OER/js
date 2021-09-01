/* Setup vars */
const DEBUG=false
const jwp = $("script:contains('file')")
const idElem = $(jwp[0]).text().replace(/.*jwplayer\("player(.)"\).*/gs, `$1`);
const imgElem = $(jwp[0]).text().replace(/.*image: "(.*jpg)",(.*)/gms, `$1`);
const vidElemLoRegX = new RegExp('.*player'+idElem+'.*?\\[?{?\\s*file: "(.*?mp4?)".*', "si");
const vidElemLo = $(jwp[0]).text().replace(vidElemLoRegX, `$1`);
const vidResLoRegX = new RegExp(".*player"+idElem+".*?file:.*?x([0-9]{3,4})?\.mp4.*", "s");
const vidResLo = $(jwp[0]).text().replace(vidResLoRegX, `$1`);
const captionElem = $("#player"+idElem).nextAll("p").text();
const headerElem =$("#player"+idElem).nextAll("h4").text();
const learnElem = $("#player"+idElem).nextAll("h4").nextAll("a").attr('href');
/* Optionals logic */
let optKey = '000'; //lo|hi|vtt
if ([...$(jwp[0]).text().matchAll(new RegExp('file', 'gi'))].map(a => a.index).length === 3) { //lo, hi res, and vtt
    optKey='111';
} else if ([...$(jwp[0]).text().matchAll(new RegExp('file', 'gi'))].map(a => a.index).length === 2) {
    if([...$(jwp[0]).text().matchAll(new RegExp('vtt', 'gi'))].map(a => a.index).length === 1) { //lo res and vtt
        optKey='101';
    } else { //lo and hi res
        optKey='110';
    }
} else { //lo res
    optKey='100';
}
/* Optional vars */
const vidElemHiRegX = new RegExp('.*player'+idElem+'.*?},\\s?{(\\s.*?file:)\\s.*?"(.*?mp4?)".*', "si");
const vidElemHiComment = $(jwp[0]).text().replace(vidElemHiRegX, `$1`);
const vidElemHi = $(jwp[0]).text().replace(vidElemHiRegX, `$2`);
const vidResHiRegX = new RegExp(".*player"+idElem+".*?},\\s?{.*?x([0-9]{3,4})?\.mp4.*", "si");
const vidResHi = $(jwp[0]).text().replace(vidResHiRegX, `$1`);
const vttElem = $(jwp[0]).text().replace(/.*tracks: \[{\s*file: (".*vtt").*/gms, `$1`);
/* Check for jwplayer in string - means translator didn't replace properly */
if(vidElemLo.includes("jwplayer") || vidResLo.includes("jwplayer") || imgElem.includes("jwplayer") ) {
    console.log("There has been a problem with the codebase translator. Please refer this file to John Chase for further research...")
/* Translator succeeded */
} else {
    /* Show VJS snippet */
    let vjs=`
    <div class="highlight col-xs-12 col-md-4">
    \t<video
    \t\tid="video${idElem}"
    \t\tclass="video-js vjs-big-play-centered vjs-16-9 vjs-default-skin"
    \t\tcontrols
    \t\tpreload="none"
    \t\tposter="${imgElem}"
    \t\tdata-setup='{"controlBar": {"pictureInPictureToggle": false, "volumePanel": {"inline": false}}}'
    \t>
    \t\t<source src="${vidElemLo}?${vidResLo}" type="video/mp4" label="SD" res="${vidResLo}" />`;
        /* Show appropriate optionals */
        if((optKey === '110' || optKey === '111') && !vidElemHiComment.includes('//') || ((optKey === '111' || optKey === '110') && vidElemHi.includes("jwplayer")) || ((optKey === '111' || optKey === '110') && vidResHi.includes("jwplayer"))) { 
            vjs+=`\n\t\t<source src="${vidElemHi}?${vidResHi}" type="video/mp4" label="HD" res="${vidResHi}" />`
        }
        if(optKey === '101' || optKey === '111' && vttElem.includes("jwplayer")) {        
            vjs+=`\n\t\t<track kind="captions" src=${vttElem} srclang="en" label="English">`
        }
        vjs+=`\n\t\t<p class="vjs-no-js">To view this video please enable JavaScript, and consider upgrading to a web browser that <a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video&nbsp;<span class="glyphicon glyphicon-new-window" aria-hidden="true"></span></a></p>
        \t</video>
        \t<h4>${headerElem}</h4>
        \t<p>${captionElem}</p>
        \t<a class="read-more" href="${learnElem}">Learn more</a>
    </div>`
    console.log(vjs);
    /* Debug output */
    if(DEBUG) {
        console.log("\n\n")
        console.log("DEBUGGER:\n\n");
        console.log(optKey)
        console.log("MATCH: "+[...$(jwp[0]).text().matchAll(new RegExp('file', 'gi'))].map(a => a.index).length)
        console.log("ID: "+idElem)
        console.log("IMG: "+imgElem)
        console.log("VIDLO: "+vidElemLo)
        console.log("VIDRESLO: "+vidResLo)
        console.log("VIDRESLOREGX: "+vidResLoRegX)
        console.log("Hi Res commented out: "+vidElemHiComment.includes('//'))
        if((optKey === '111' || optKey === '110') && !vidElemHiComment.includes('//')) {
            console.log("VIDHI: "+vidElemHi)
            console.log("VIDHIREGX: "+vidElemHiRegX)
            console.log("VIDRESHI: "+vidResHi)
            console.log("VIDRESHIREGX: "+vidResHiRegX)
        }
        if(optKey === '111' || optKey === '101') {
            console.log("VTT: "+vttElem)
        }
        console.log("Caption: "+captionElem)
        console.log("Header: "+headerElem)
        console.log("Learn: "+learnElem)
    }
}