const callback = async(req, res) => {
    const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.query;
    res.json({
        success: true,
        message: 'telegram login success!',
        data: {
            first_name,
            last_name,
            username,
            photo_url,
            auth_date,
            hash,
        }
    })
}

module.exports = {callback};