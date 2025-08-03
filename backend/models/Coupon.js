import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		discount: {
			type: Number,
			required: true,
		},
		expire: {
			type: Date,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Coupon', couponSchema);
