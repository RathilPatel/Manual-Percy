const PercyScript = require('@percy/script');

PercyScript.run(async (page, percySnapshot) => {
  await page.goto('http://www.yahoo.com');
  await percySnapshot('homepage1');
});
