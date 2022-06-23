const cheerio = require("cheerio");
const request = require("request-promise");
const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs-extra");

const writeStream = fs.createWriteStream('links.csv')

const urls = [];

let _mainURI = 'https://tioanime.com/ver/naruto-'//prompt("URI del anime sin el ultimo numero: ");
let capAmount = 220//prompt("Cantidad de capitulos: ");
let selDescarga = '#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(6) > td.text-center > a'//prompt("Selector de descarga: ");

writeStream.write('Numero de capitulo;Link\n');

async function getURL(capAmount,urls) {
    const auxArray = []
  for (index = 1; index <= capAmount; index++) {
    const $ = await request({
      uri: `${_mainURI}${index}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
      },
      transform: (body) => cheerio.load(body),
    });
    let downloadbutton = await $(selDescarga).attr('href');
    if(await downloadbutton.includes('mega.nz')){
       downloadbutton = await $('#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(5) > td.text-center > a').attr('href'); 
    }else(console.log('NO SE ENCONTRO ZIPPY'))
    //auxArray.push(downloadbutton.attr('href'));
    writeStream.write(`${index};${downloadbutton}\n`);
    console.clear()
    console.log("\x1b[33m", `Obteniendo link del capitulo ${index}`);
  }

  console.log("\x1b[32m%s",'\n Finished');
}

getURL(capAmount);

urls.forEach((url) => {
  console.log(url);
});
