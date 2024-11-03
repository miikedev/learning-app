const express = require('express')
const app = express()

app.get('/',function(req,res) {
    res.json({success:true})
})




app.listen(3000,() => {
    console.log('listening on port 3000');
})

module.exports = app