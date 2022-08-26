const puppeteer =require('puppeteer');
const fs = require('fs');

const email="xosoti1365@altpano.com";
const password="456789";
async function Automation(){
    try{
    const browser = await puppeteer.launch({
        headless:false,
        args:['--start-maximized'],
        defaultViewport :null
    })
    const page = await browser.newPage();
    await page.goto("https://www.hackerrank.com/auth/login");
    await page.type("input[type='text']",email);
    await page.type("input[type='password']",password);
    await page.click(".ui-btn[type='submit']");
    await page.waitForTimeout(3000);
    await waitandclick(".topic-name",page);
    await waitandclick("input[value='warmup']",page);
    await waitandclick("input[value='solved']",page);
    await waitandclick(".ui-btn.ui-btn-normal.primary-cta",page);
    await page.waitForTimeout(5000);
    await waitandclick(".checkbox-input",page);
    await solveQuestion(page,"ans.txt");
    await page.waitForTimeout(10000);
    await browser.close();
    }catch(err){
        console.log("Error:"+err);
    }   
}
Automation();
async function waitandclick(selector, cpage){
    await cpage.waitForSelector(selector,{visible:true});
    return cpage.click(selector);
}


async function solveQuestion(cpage,answer){
    let ans = await fs.promises.readFile(answer);
    ans =ans.toString().trim();
    await cpage.waitForSelector("textarea.input",{visible:true});
    await cpage.type("textarea.input",ans);
    await cpage.keyboard.down("Control");
    await cpage.keyboard.press("A");
    await cpage.keyboard.press("X");
    await cpage.keyboard.up("Control");
    await cpage.click(".view-lines");
    await cpage.keyboard.down("Control");
    await cpage.keyboard.press("A");
    await cpage.keyboard.press("V");
    await cpage.keyboard.up("Control");
    return cpage.click(".hr-monaco-compile");
}