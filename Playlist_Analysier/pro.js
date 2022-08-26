const puppeteer =require("puppeteer");
const url = "https://www.youtube.com/playlist?list=PLRBp0Fe2GpglJwMzaCkRtI_BqQgU_O6Oy";
const fs = require('fs');
const pdf = require("pdfkit");
(async function(){
    try{
        const browser = await puppeteer.launch({
            headless:false,
            args: ['--start-maximized'],
            defaultViewport:null
        });
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitForSelector("h1#title");
        const playlist_name=  await page.evaluate(() => {
            return document.querySelector('h1#title').innerText;
        });
        // const playlist_name=await page.$eval('h1#title', ele => ele.textContent);
        // const details = await page.evaluate(getdata,"div#stats");
        await page.waitForSelector("span[dir='auto']");
        // const videos=  await page.evaluate((selector) => {
        //     return document.querySelector(selector).innerText;
        // })
        // #stats .style-scope.ytd-playlist-sidebar-primary-info-renderer
        // #stats .style-scope.yt-formatted-string
        await page.waitForSelector("#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer");
        const Playlist_details = await page.evaluate(getdata,"#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer");
        console.log(playlist_name,"\n")
        console.log(Playlist_details);
        const Total_videos= Playlist_details.video.split(" ")[0];
        console.log(Total_videos)
        let curr_videos=await page.evaluate(getlength,"a#video-title");
        console.log(curr_videos)
        while(Total_videos-curr_videos>10){
            await page.evaluate(()=>window.scrollBy (0,window.innerHeight))
            curr_videos= await page.evaluate(getlength,"a#video-title")
        } 
        const list= await page.evaluate(getdetails,"a#video-title","span.style-scope.ytd-thumbnail-overlay-time-status-renderer")
        console.log(list);
        fs.promises.writeFile("youtube.txt",list)
        const doc =new pdf;
        doc.pipe(fs.createWriteStream("Playlist.pdf"));
        doc.text(JSON.stringify(list));
        doc.end();
    }catch(err){
        console.log("error:",err);
    }
})(); 

function getdata(selector){
    const all_elements = document.querySelectorAll(selector);
    const video= all_elements[0].innerText;
    const views = all_elements[1].innerText;
    return{ 
        video, views
    }
}
function getlength(selector) {
    const len=document.querySelectorAll(selector);
    return len.length;
}

function getdetails(name,duration){
    const video_name =document.querySelectorAll(name);
    const video_duration=document.querySelectorAll(duration);
    let list = [];
    for(let i=0; i<video_duration.length; i++){
        const curr_video_name= video_name[i].innerText;
        const curr_video_duration=video_duration[i].innerText;
        list.push(curr_video_name,curr_video_duration);
    }
    return list;
}


