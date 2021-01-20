var express = require('express');
var bodyParser = require("body-parser");
const PercyScript = require('@percy/script');
const dotenv = require('dotenv');

const fs = require('fs');
var sitemaps = require('sitemap-stream-parser');
// const PercyScript = require('@percy/script');
const { spawn } = require('child_process')
const urls = []; //store all discovered urls
dotenv.config();

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public')); //__dir and not _dir
var port = 5000; // you can use any port
app.get('/', function (req, res) {
    res.sendFile('index.html');
});
app.post('/submit', function (req, res) {
    website_url = req.body.url; //capture webpage url here
    percy_token = req.body.token;
    branch = req.body.branch;
    process.env.URL=website_url;
    res.redirect('/');

    // process.env.PERCY_TOKEN = '9057676433c5bef5b03a7af7021e59edda91573a344ac0e63eeb87099d5ee81d'
    process.env.PERCY_TOKEN = percy_token
    process.env.PERCY_BRANCH = branch


    console.log("Percy TOKEN:  "+process.env.PERCY_TOKEN)      
    percy_start = spawn("npx",['percy','start'])
    percy_start.stdout.on('data',(data) => {   
        console.log(`data: ${data}`);
    });
    percy_start.stderr.on('data',(err) => {
        console.log(`error: ${err}`);
    }); 
    console.log("Process Id for Percy Start : "+percy_start.pid);  
    try {
        getSitemaps(website_url)  
    } catch (error) {

        console.log("Error Log: "+e)
    }
    
});


async function getSitemaps(url){
    // 'http://dev.accounts.com/sitemap.xml'
    await sitemaps.parseSitemapsPromise(url, url=>{
       urls.push(url);
       // console.log('adding ', url)
       }, function(err, sitemaps) {
       console.log('total urls', urls.length)
       });
 
     console.log('this is called last');              
     snapshot();
 
 
 }
 
 function snapshot(){
    PercyScript.run(async(page, percySnapshot) => {    
        
 
         for (let index = 0; index < urls.length; index++) {
             
             let link = urls[index];        
             await page.goto(link);
             let title = await page.title();
             console.log(title);
             console.log(urls[index]);
             await percySnapshot(title, { widths: [1200] });
         }
 
         percy_stop = spawn("kill",[percy_start.pid])
         console.log("Process Id for KILL: "+percy_stop.pid);
     });
    
 }





app.listen(port);
console.log('Access your Percy Local app on http://localhost:' + port);
console.log('Percy Token:'+ process.env.PERCY_TOKEN);
