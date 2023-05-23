const OAuthAuthen = (req,res,next) => {
    try {
        if (req.user) 
        next();
        else {
            res.json({loggedIn: false})
        }
    } catch (err) {
        res.json({msg: "Invalid credentials"})
    }

}

module.exports = OAuthAuthen