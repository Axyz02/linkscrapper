const cheerio = require("cheerio");
const request = require("request-promise");
const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs-extra");

// ? Funcion para escribir el CSV
let animeName = prompt("Nombre del anime: ");
const writeStream = fs.createWriteStream(`${animeName}.csv`);

let anotherAnime = false;
let _mainURI = prompt("URI del anime sin el ultimo numero: ");
let capAmount = prompt("Cantidad de capitulos: ");
let selDescarga = [
  "#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(1) > td.text-center > a",
  "#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(2) > td.text-center > a",
  "#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(3) > td.text-center > a",
  "#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(4) > td.text-center > a",
  "#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(5) > td.text-center > a",
  "#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(6) > td.text-center > a",
];

//? Escribiendo el titurlo del CSV
writeStream.write("Numero de capitulo;Link\n");

//? Main function
async function getURL(capAmount) {

  //? For para recorrer cada link de capitulo
  for (index = 1; index <= capAmount; index++) {
    //? Descarga del body de la pagina
    const $ = await request({
      uri: `${_mainURI}${index}`,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
      },
      transform: (body) => cheerio.load(body),
    });

    //? Conseguir las URL de cada capitulo
    let downloadbutton = await $(selDescarga[0]).attr("href"); //Selector 4
    let auxCounter = 1;

    //? Manetener todas las url con zippyshare y escribirlas
    while (!await downloadbutton?.includes('zippy')){
      downloadbutton = await $(selDescarga[auxCounter]).attr('href');
      auxCounter++;
      console.log(auxCounter);
    if(auxCounter>6) break;
    }

    //#downloads > div > div > div.modal-body > div > table > tbody > tr:nth-child(3) > td.text-center > a

    console.log('salio')
    //? Una vez encontrado el link de zippyshare lo escribimos en el csv
    writeStream.write(`${index};${downloadbutton}\n`);

    console.clear();
    console.log("\x1b[33m", `Obteniendo link del capitulo ${index}`);
  }

  console.log("\x1b[32m%s", "\n Finished");
}

async function testURL(capNumber) {
  const $ = await request({
    uri: `${_mainURI}${capNumber}`,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44",
    },
    transform: (body) => cheerio.load(body),
  });

  let auxCounter = 1;
  let downloadbutton = await $(selDescarga[0]).attr("href"); //Selector 4
  //? Manetener todas las url con zippyshare y escribirlas
 while (!await downloadbutton?.includes('zippy')){
    downloadbutton = await $(selDescarga[auxCounter]).attr('href');
    console.log(downloadbutton);
    auxCounter++;
    if(auxCounter>6) break;
  } 

  console.log(downloadbutton);
  //console.clear()
  console.log("\x1b[33m", `Obteniendo link del capitulo `);

  console.log("\x1b[32m%s", "\n Finished");
}

/* do {
  console.log("\x1b[35m", "Bienvenido!");
*/  getURL(capAmount);
/* } while (anotherAnime);
 */ 

//testURL(3)