import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import config from '../config';
import { User } from '../app/modules/user/user.model';
import { USER_ROLES } from '../enums/user';

class PassportHelper {
    constructor() {}

    googleStrategy() {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: config.google.client_id!,
                    clientSecret: config.google.client_secret!,
                    callbackURL: config.google.redirect_url!,
                    passReqToCallback: true, // optional if you need the request in verify
                    scope: ['email', 'profile'],
                },
                // Verify function
                async(request: any, accessToken:string, refreshToken:string, profile:any, done:any) => {
                    let user = await User.findOne({email:profile.emails[0].value});
                    if(!user){
                        user = await User.create({
                            email:profile.emails[0].value,
                            name:profile.displayName,
                            password:profile.id,
                            image:profile?.photos?.[0]?.value,
                            isSocialLogin:true,
                            verified:true,
                            role:USER_ROLES.USER
                        });
                    }
                    return done(null, user);
                }
            )
        );
    }

    

    // Middleware to initialize passport in Express
    initialize() {
        return [passport.initialize(), passport.session()];
    }

    // Optional: serialize & deserialize user
    serialize() {
        passport.serializeUser((user: any, done) => done(null, user));
        passport.deserializeUser((user: any, done) => done(null, user));
    }

     passport = passport;
}



const passportHelper = new PassportHelper();

passportHelper.googleStrategy();
passportHelper.serialize();
export default passportHelper;
