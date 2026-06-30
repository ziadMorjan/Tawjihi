import mongoose from 'mongoose';

const replySchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true,
			maxlength: 500,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

const commentSchema = new mongoose.Schema(
	{
		lesson: {
			type: mongoose.Types.ObjectId,
			ref: 'Lesson',
			required: true,
		},
		user: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		content: {
			type: String,
			required: [true, 'Review comment is required'],
			trim: true,
			maxlength: [500, 'Review comment must be less than 500 characters'],
		},
		replies: [replySchema],
	},
	{
		timestamps: true,
	},
);

commentSchema.pre(/^find/, function (next) {
	this.populate({
		path: 'lesson',
		select: 'name course',
	});

	this.populate({
		path: 'user',
		select: 'name coverImage',
	});

	this.populate({
		path: 'replies.user',
		select: 'name coverImage',
	});

	next();
});

export default mongoose.model('Comment', commentSchema);
