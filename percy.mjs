const fs = require('fs');
var sitemaps = require('sitemap-stream-parser');
const PercyScript = require('@percy/script');
const { spawn } = require('child_process')


const urls = []; //store all discovered urls



// app.post('/', function(req, res) {


//     // Get INPut Values and save as ENV variable
//     //Call spawn method to start percy agent command is npx percy start
//     // getsitemaps("string")  call method
//     //Call spawn method to start percy agent command is npx percy stop

//     // console.log(req.body);
//     // res.sendStatus(200);
//   //  takePercySnapshot("Test" , { widths: [768, 992, 1200] });
//   });




 export async function getSitemaps(){
   await sitemaps.parseSitemapsPromise('http://dev.accounts.com/sitemap.xml', url=>{
      urls.push(url);
      // console.log('adding ', url)
      }, function(err, sitemaps) {
      console.log('total urls', urls.length)
      });

    console.log('this is called last');              
    snapshot();


}

export function snapshot(){
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


console.log("before function call!");
process.env.PERCY_TOKEN = '69b6988542b9d11d7c8bc510688e37c5b7d7d408f6bfd4408c8e6ee876df4161'

console.log("Percy TOKEN:  "+process.env.PERCY_TOKEN)


 percy_start = spawn("npx",['percy','start'])

percy_start.stdout.on('data',(data) => {
 
  console.log(`data: ${data}`);
 
});
percy_start.stderr.on('data',(err) => {
  console.log(`error: ${err}`);

});

console.log("Process Id for Percy Start : "+percy_start.pid);

getSitemaps()





// process.env['PERCY_TOKEN'] = '69b6988542b9d11d7c8bc510688e37c5b7d7d408f6bfd4408c8e6ee876df4161'
// process.env['PERCY_BRANCH'] = 'test'
console.log("After function call!");

