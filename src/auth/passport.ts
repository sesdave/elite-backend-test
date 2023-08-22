import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models'; // Import your User model

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key', // Replace with your actual secret key
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    // Find the user based on the payload
    const user = await User.findByPk(payload.sub);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);

export default passport;
