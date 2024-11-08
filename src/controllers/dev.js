module.exports = {
    appleReview: (req, res) => {
        res.status(200).json({
            "status": 200,
            "is_review": false
        })
    }
}