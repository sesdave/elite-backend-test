import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models'; // Import your User model

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your-secret-key',
};

const jwtStrategy = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findByPk(payload.sub);
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  } catch (error) {
    done(error, false);
  }
});

passport.use(jwtStrategy);
