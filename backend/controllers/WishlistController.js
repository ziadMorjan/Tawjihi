const User = require("../models/User");
const { asyncErrorHandler } = require("../middlewares/errorMiddleware");

const getUserWishlist = asyncErrorHandler(async (req, res) =>
    res.status(200).json({
        status: "success",
        wishlist: req.user.wishlist
    })
);

const addToWishlist = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(req.user.id,
        {
            $addToSet: { wishlist: req.params.courseId }
        },
        {
            runValidators: true,
            new: true
        }
    );

    res.status(200).json({
        status: "success",
        wishlist: user.wishlist
    })
});

const removeFromWishlist = asyncErrorHandler(async function (req, res) {
    let user = await User.findByIdAndUpdate(req.user.id,
        {
            $pull: { wishlist: req.params.courseId }
        },
        {
            runValidators: true,
            new: true
        }
    );

    res.status(200).json({
        status: "success",
        wishlist: user.wishlist
    })
});

module.exports = {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist
}
