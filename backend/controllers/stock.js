/* ******************** */
//        Stock.js      *
/* ******************** */

require('dotenv').config();
const axios = require('axios');

/* ******************** */
//   Helper Functions   *
/* ******************** */

function getCurrentTime(){
  /*  return the current time in yyyy-mm-dd hh:mm:ss format */
  const dateOb = new Date();
  const date = ("0" + dateOb.getDate()).slice(-2);   // adjust 0 before single digit date
  const month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
  const year = dateOb.getFullYear();
  const hours = ("0" + (dateOb.getHours())).slice(-2);
  const minutes = ("0" + (dateOb.getMinutes())).slice(-2);
  const seconds = ("0" + (dateOb.getSeconds())).slice(-2);

  return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}
function getLastyearTime(){
 /*  return the last year time from current time in yyyy-mm-dd hh:mm:ss format */
  const dateOb = new Date();
  const date = ("0" + dateOb.getDate()).slice(-2);
  const month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
  const year = dateOb.getFullYear()-1;
  const hours = ("0" + (dateOb.getHours())).slice(-2);
  const minutes = ("0" + (dateOb.getMinutes())).slice(-2);
  const seconds = ("0" + (dateOb.getSeconds())).slice(-2);

  return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}
const getCompanyName = (symbol) => new Promise((resolve, reject) => {
  /* Returns Company Name 
     Input: stock symbol 
     Output: Company Name */
  axios.get(`https://api.twelvedata.com/stocks?symbol=${symbol}`) // Making an API call from twelvedata to get company name
    .then((response) => {
      resolve(response.data.data[0].name)})
    .catch((error) => reject(error));
});
const getHistoricalData = (symbol) => new Promise((resolve, reject) => {
  /* Returns the historical stock data 
     Input: stock symbol 
     Output: a list historical data
            {"datetime","open,"high","low","close","volume"} */
  axios.get(`https://api.twelvedata.com/time_series?`+
            `symbol=${symbol}&interval=1day&outputsize=365&format=JSON&`+
            `start_date=${getLastyearTime()}&`+
            `end_date=${getCurrentTime()}&`+
            `apikey=${process.env.STOCK_DATA_API}`)
    .then((response) => {
      const historical = response.data.values
      for (const element of historical) {
        element.date = element.datetime;
        delete element.datetime;
        delete element.volume;
      }
      resolve(response.data.values)})
    .catch((error) => reject(error));
});


/* ******************** */
//      Controllers     *
/* ******************** */



exports.getStock = (req,res) =>{
  Promise.all([getCompanyName(req.params.symbol),
               getHistoricalData(req.params.symbol)]).then(([name,historicalData]) => {

    const response = { 'symbol':req.params.symbol,
                        'companyName':name,
                        'curPrice':historicalData[0].close,
                        'historical':historicalData}
    res.send({ response })
  })
  .catch((err)=>{
    console.log(err)
  })
}