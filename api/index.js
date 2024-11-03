const express = require('express')
const app = express()

app.get('/api',function(req,res) {
    res.json({success:true,message: 'welcome to learning app api'})
})




app.listen(3000,() => {
    console.log('listening on port 3000');
})

module.exports = app