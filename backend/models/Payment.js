import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Payment', paymentSchema);
