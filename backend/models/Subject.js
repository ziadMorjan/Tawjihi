import mongoose from 'mongoose';

const subjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
		},
		slug: {
			type: String,
			lowercase: true,
		},
		description: {
			type: String,
			minlength: 10,
			maxlength: 1000,
		},
		branch: {
			type: mongoose.Types.ObjectId,
			ref: 'Branch',
		},
	},
	{
		timestamps: true,
	},
);

subjectSchema.pre(/^find/, function (next) {
	this.populate({ path: 'branch', select: 'name' });
	next();
});

export default mongoose.model('Subject', subjectSchema);
