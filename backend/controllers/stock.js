/* ******************** */
//        Stock.js      *
/* ******************** */
require('dotenv').config();
const axios = require('axios');

/* ******************** */
//   Helper Functions   *
/* ******************** */
function getCurrentTime(){
  const dateOb = new Date();
  // adjust 0 before single digit date
  const date = ("0" + dateOb.getDate()).slice(-2);
  const month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
  const year = dateOb.getFullYear();
  const hours = ("0" + (dateOb.getHours())).slice(-2);
  const minutes = ("0" + (dateOb.getMinutes())).slice(-2);
  const seconds = ("0" + (dateOb.getSeconds())).slice(-2);

  return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}
function getLastyearTime(){
  const dateOb = new Date();
  // adjust 0 before single digit date
  const date = ("0" + dateOb.getDate()).slice(-2);
  const month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
  const year = dateOb.getFullYear()-1;
  const hours = ("0" + (dateOb.getHours())).slice(-2);
  const minutes = ("0" + (dateOb.getMinutes())).slice(-2);
  const seconds = ("0" + (dateOb.getSeconds())).slice(-2);

  return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}
const getCompanyName = (symbol) => new Promise((resolve, reject) => {
  // Making an API call from twelvedata to get company name
  axios.get(`https://api.twelvedata.com/stocks?symbol=${symbol}`)
    .then((response) => {
      console.log(response.data.data[0].name)
      resolve(response.data.data[0].name)})
    .catch((error) => reject(error));
});
const getHistoricalData = (symbol) => new Promise((resolve, reject) => {
  // Making an API call from twelvedata to get company name
  axios.get(`https://api.twelvedata.com/time_series?
             symbol=${symbol}&interval=1day&outputsize=365&format=JSON
             &start_date=${getLastyearTime()}
             &end_date=${getCurrentTime()}
             &apikey=${process.env.STOCK_DATA_API}`)
    .then((response) => {
      console.log(response.data)
      resolve(response.data)})
    .catch((error) => reject(error));
});

/* ******************** */
//      Controllers     *
/* ******************** */
exports.getStock = (req,res) =>{
  console.log(console.log(process.env.STOCK_DATA_API))
  res.status(200).json({ message: process.env.STOCK_DATA_API })

  // Promise.all([getCompanyName(req.params.symbol),
  //              getHistoricalData(req.params.symbol)]).then(([name,historicalData]) => {
  //   const stockData = { 'symbol':req.params.symbol,
  //                       'name':name}
  //   console.log(historicalData)
  //   res.send({ stockData })
  // })
  // .catch((err)=>{
  //   console.log(err)
  // })
}