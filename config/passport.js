const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Datastore = require('nedb-promises');
const path = require('path');

const users = Datastore.create({
  filename: path.join(__dirname, '..', 'data', 'users.db'),
  autoload: true
});

// Serialize: store user._id in session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize: retrieve full user from DB by _id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await users.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Helper: find or create user by provider
async function findOrCreateUser(providerId, providerField, profile) {
  // Check if user exists by provider ID
  let user = await users.findOne({ [providerField]: providerId });
  if (user) return user;

  // Check if email already exists (link accounts)
  const email = profile.emails && profile.emails[0] && profile.emails[0].value;
  if (email) {
    user = await users.findOne({ email: email });
    if (user) {
      await users.update({ _id: user._id }, { $set: { [providerField]: providerId } });
      user[providerField] = providerId;
      return user;
    }
  }

  // Create new user
  return await users.insert({
    [providerField]: providerId,
    name: profile.displayName || 'Usuário',
    email: email || '',
    avatar: (profile.photos && profile.photos[0] && profile.photos[0].value) || '',
    provider: providerField.replace('Id', ''),
    createdAt: new Date()
  });
}

// --- Google Strategy ---
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile.id, 'googleId', profile);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

// --- Facebook Strategy ---
if (process.env.FACEBOOK_APP_ID) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.BASE_URL + '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile.id, 'facebookId', profile);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }));
}

module.exports = passport;
