

exports.getwatchlist = (err,res,req) =>{
  console.log(req.userId)
  if (req.userId) {
    res.send(`Yo~~~~~~${req.userId}`)
  } else {
    console.log(err.message)
    res.status(401).send({ message: 'Please Login First'})
  }
}

exports.addToWatchlist = (res,req) =>{
  
}

exports.removeFromWatchlist = (res,req) =>{
  
}