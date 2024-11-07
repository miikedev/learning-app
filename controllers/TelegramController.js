

const callback = async(req, res) => {
    res.json({
        success: true,
        message: 'telegram login success!'
    })
}

module.exports = {callback};