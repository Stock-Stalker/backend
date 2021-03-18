
const { getStock, getUser, checkDuplicate } = require('../utils/watchlist')
const User = require("../models/user")
const Symbols = require('../models/symbols')

exports.getwatchlist = async (req,res) =>{
  try{
    const user = await getUser(req.userId)
    // TODO: populate this so we don't just get the id reference back
    res.send(user.watchlist)
  }catch (err) {
    res.status(403).send({ message: err.message })
  }
}

exports.addToWatchlist = async (req,res) =>{
  try{
    const user = await getUser(req.userId)
    const stock = await getStock(req.body.symbol)
    if (!checkDuplicate(stock._id,user.watchlist)) {
      user.watchlist.unshift(stock);
    }
    user.save()
    res.send(user.watchlist)
   } catch (err) {
    res.status(403).send({ message: err.message })
  }
}

exports.removeFromWatchlist = async (req,res) => {
  try {
    const symbolToRemove = await Symbols.findOne({symbol:req.params.symbol});
    const symbolID = symbolToRemove._id;
    const updatedUser = await User.findByIdAndUpdate(req.userId,
        { $pull: {watchlist:symbolID}},{new: true}).populate('watchlist');
    return res.status(200).send(updatedUser.watchlist);
  } catch (err) {
    return res.status(403).send({ message: err.message });
  }
}
