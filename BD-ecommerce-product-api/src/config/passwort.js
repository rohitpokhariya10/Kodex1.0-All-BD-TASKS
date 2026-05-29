const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    // This verification function runs after Google sends profile data
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log("Google profile-->", profile);

        const googleId = profile.id;
        const name = profile.displayName || "Google User";
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();
        const isEmailVerified = profile.emails?.[0]?.verified || false;
        const avatarUrl = profile.photos?.[0]?.value || "";

        if (!email) {
          return cb(null, false, {
            message: "Google account email not found",
          });
        }

        // First check user by email
        let user = await User.findOne({ email }).select("+googleId");

        // If user already exists
        if (user) {
          user.googleId =  googleId;
          user.isEmailVerified = isEmailVerified;

          if (!user.avatar?.url && avatarUrl) {
            user.avatar = {
              url: avatarUrl,
              fileId: "",
            };
          }

          
          user.authProvider = "google";

          await user.save({ validateBeforeSave: false });

          return cb(null, user);
        }

        // If user does not exist, create new Google user
        user = await User.create({
          name,
          email,
          googleId,
          authProvider: "google",
          isEmailVerified,
          avatar: {
            url: avatarUrl,
            fileId: "",
          },
        });

        return cb(null, user);
      } catch (error) {
        console.error("Error in passport.js", error);
        return cb(error, null);
      }
    }
  )
);

module.exports = passport;