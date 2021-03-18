const User = require("../models/user")
const Symbols = require('../models/symbols')


const getStock = (symbol) => new Promise ((resolve, reject) => {
  Symbols.findOne({symbol:symbol})
  .then((stock)=>resolve(stock))
  .catch((error)=>reject(error))
})
const getUser = async (userId) => {
  try{
    const user = await User.findOne({_id:userId})
    return user
  } catch (err){
    return err
  }  
}

const checkDuplicate = (stockId,watchlist) => {
  for(let i=0;i<watchlist.length;i++){
    if(String(stockId) === String(watchlist[i]._id)){
      return true
    }
  } return false
}

exports.getwatchlist = async (req,res) =>{
  try{
    const user = await getUser(req.userId)
    res.send(user.watchlist)
  }catch (err) {
    res.status(403).send({ message: err.message })
  }
}

exports.addToWatchlist = async (req,res) =>{
  try{
    const user = await getUser(req.userId)
    const stock = await getStock(req.params.symbol)
    if (!checkDuplicate(stock._id,user.watchlist)) {
      user.watchlist.unshift(stock);
    }
    user.save()
    res.send(user.watchlist)
   } catch (err) {
    res.status(403).send({ message: err.message })
  } 
}

exports.removeFromWatchlist = (req,res) =>{
  Symbols.findOne({symbol:req.params.symbol})
  .then((symbolToRemove)=>{
    const symbolID = symbolToRemove._id
    return User.findByIdAndUpdate(req.userId,
      { $pull: {watchlist:symbolID}},{new: true}).populate('watchlist')
  }).then((updatedUser) =>{
      console.log(updatedUser);
      res.status(200).send(updatedUser);
  }).catch((err) =>{
    res.status(403).send({ message: err.message })
  })
}
