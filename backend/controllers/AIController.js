import { GoogleGenerativeAI } from '@google/generative-ai';
import Lesson from '../models/Lesson.js';
import Course from '../models/Course.js';
import Enrollment from '../models/Enrollment.js';
import CustomError from '../utils/CustomError.js';
import { asyncErrorHandler } from '../middlewares/errorMiddleware.js';

// Models to try in order when one is unavailable (503/429)
const FALLBACK_MODELS = [
	'gemini-2.5-flash',
	'gemini-2.0-flash',
	'gemini-2.0-flash-lite',
	'gemini-2.5-flash-lite',
];

/**
 * Sleep helper
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Returns true if the error is a transient capacity/rate-limit error
 * that is worth retrying.
 */
const isRetryable = (err) => {
	const status = err?.status;
	return status === 503 || status === 429;
};

/**
 * Attempt content generation with per-model retries (exponential backoff)
 * and automatic fallback to the next model in FALLBACK_MODELS on failure.
 *
 * @returns {{ result, wasOverloaded }}
 *   result         – the raw Gemini result
 *   wasOverloaded  – true if at least one 503/429 was hit before success
 */
async function generateWithFallback(genAI, prompt, primaryModel) {
	const modelsToTry = [primaryModel, ...FALLBACK_MODELS.filter((m) => m !== primaryModel)];

	let wasOverloaded = false;
	let lastError = null;

	for (const modelName of modelsToTry) {
		const model = genAI.getGenerativeModel({ model: modelName });
		const MAX_RETRIES = 3;

		for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
			try {
				console.log(
					`[AI] Trying model "${modelName}" (attempt ${attempt}/${MAX_RETRIES})...`,
				);

				const result = await model.generateContent({
					contents: [{ role: 'user', parts: [{ text: prompt }] }],
					generationConfig: { responseMimeType: 'application/json' },
				});

				console.log(`[AI] Success with model "${modelName}" on attempt ${attempt}.`);
				return { result, wasOverloaded };
			} catch (err) {
				lastError = err;

				if (isRetryable(err)) {
					wasOverloaded = true;

					if (attempt < MAX_RETRIES) {
						// Exponential backoff: 2s, 4s, 8s
						const waitMs = Math.pow(2, attempt) * 1000;
						console.warn(
							`[AI] Model "${modelName}" returned ${err.status}. ` +
							`Retrying in ${waitMs / 1000}s... (attempt ${attempt}/${MAX_RETRIES})`,
						);
						await sleep(waitMs);
					} else {
						console.warn(
							`[AI] Model "${modelName}" exhausted all ${MAX_RETRIES} retries. ` +
							'Trying next fallback model...',
						);
					}
				} else {
					// Non-retryable (e.g. 400, 401, 404) — propagate immediately, don't try other models
					console.error(
						`[AI] Non-retryable error (${err.status}) from model "${modelName}":`,
						err,
					);
					throw err;
				}
			}
		}
	}

	// All models and retries exhausted
	throw lastError;
}

export const getOrGenerateAIContent = asyncErrorHandler(async (req, res, next) => {
	const { lessonId } = req.params;

	// 1. Fetch lesson
	const lesson = await Lesson.findById(lessonId);
	if (!lesson) {
		throw new CustomError(req.__('generic.not_found') || 'Lesson not found', 404);
	}

	// 2. Fetch course
	const course = await Course.findById(lesson.course);
	if (!course) {
		throw new CustomError(req.__('generic.not_found') || 'Course not found', 404);
	}

	// 3. Authorization Check
	const isAdmin = req.user.role === 'admin';
	const isCourseTeacher = course.teacher._id.toString() === req.user._id.toString();
	const isEnrolled = await Enrollment.findOne({ user: req.user._id, course: course._id });

	if (!isAdmin && !isCourseTeacher && !isEnrolled) {
		throw new CustomError(
			req.__('generic.not_enrolled') || 'You are not enrolled in this course',
			403,
		);
	}

	// 4. Return cached data if already generated
	if (lesson.aiSummary && lesson.aiFlashcards && lesson.aiFlashcards.length > 0) {
		return res.status(200).json({
			status: 'success',
			data: {
				aiSummary: lesson.aiSummary,
				aiFlashcards: lesson.aiFlashcards,
			},
		});
	}

	// 5. Check if API Key is configured
	const apiKey = process.env.GEMINI_API_KEY;
	if (!apiKey) {
		throw new CustomError(
			'Gemini API key is not configured in backend environment variables.',
			500,
		);
	}

	// 6. Build prompt
	const genAI = new GoogleGenerativeAI(apiKey);
	const primaryModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
	const subjectName = course.subject?.name || '';

	const prompt = `
You are an expert Palestinian teacher specializing in the Tawjihi curriculum.
Your goal is to help a student study for the lesson: "${lesson.name}" in the course "${course.name}" for the subject "${subjectName}".
Here is the description of the lesson: "${lesson.description}".

Please generate:
1. A structured, educational study summary (aiSummary) in Markdown format (Arabic language). Keep it concise, focused on key concepts, definitions, and equations if applicable. Use bullet points and headers.
2. A list of 6 interactive study flashcards (aiFlashcards). Each card must have a "front" (question, term, or date in Arabic) and a "back" (explanation, answer, or definition in Arabic).

Return the response strictly as a JSON object matching this structure:
{
  "aiSummary": "markdown text here",
  "aiFlashcards": [
    {
      "front": "front text",
      "back": "back text"
    }
  ]
}
`;

	// 7. Generate with retry + fallback
	try {
		const { result } = await generateWithFallback(genAI, prompt, primaryModel);

		const responseText = result.response.text();
		const aiData = JSON.parse(responseText);

		// 8. Persist to DB
		lesson.aiSummary = aiData.aiSummary || '';
		lesson.aiFlashcards = aiData.aiFlashcards || [];
		await lesson.save();

		res.status(200).json({
			status: 'success',
			data: {
				aiSummary: lesson.aiSummary,
				aiFlashcards: lesson.aiFlashcards,
			},
		});
	} catch (error) {
		console.error('AI Generation Error:', error);

		// Distinguish between overload (503/429) and a real failure
		const overloaded = isRetryable(error);

		throw new CustomError(
			overloaded
				? req.__('generic.ai_overloaded') ||
					'The AI service is busy. Please try again in a minute.'
				: req.__('generic.ai_generation_failed') ||
				    'Failed to generate AI content. Please try again.',
					    overloaded ? 503 : 500,
		);
	}
});
