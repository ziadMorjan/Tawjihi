const Coupon = require("../models/Coupon");
const {
    getAll,
    createOne,
    getOne,
    updateOne,
    deleteOne,
} = require("./controller");

const getAllCoupons = getAll(Coupon);

const createCoupon = createOne(Coupon);

const getCoupon = getOne(Coupon, "coupon");

const updateCoupon = updateOne(Coupon, "coupon");

const deleteCoupon = deleteOne(Coupon, "coupon");

module.exports = {
    getAllCoupons,
    createCoupon,
    getCoupon,
    updateCoupon,
    deleteCoupon,
};