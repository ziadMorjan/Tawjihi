const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/callback`
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] });
            if (user) {
                user = await User.findOneAndUpdate(
                    { email: user.email },
                    { googleId: profile.id },
                    { new: true, runValidators: true }
                );
            }
            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName
                });
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    }
);

const facebookStrategy = new FacebookStrategy(
    {
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/facebook/callback`,
        profileFields: ["displayName", "id", "emails"]
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ $or: [{ facebookId: profile.id }, { email: profile.emails[0].value }] });
            if (user) {
                user = await User.findOneAndUpdate(
                    { email: user.email },
                    { facebookId: profile.id },
                    { new: true, runValidators: true }
                );
            }
            if (!user) {
                user = await User.create({
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    facebookId: profile.id
                });
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }

    }
);

module.exports = {
    googleStrategy,
    facebookStrategy
}