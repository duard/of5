import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-linkedin-oauth2';

@Injectable()
export class LinkedinStrategy extends PassportStrategy(Strategy, 'linkedin') {
  constructor() {
    super({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_SECRET_KEY,
      callbackURL: process.env.LINKEDIN_URL,
      profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { displayName, photos } = profile;

    const user = {
      displayName,
      photo: photos[0].value,
      accessToken,
      refreshToken,
      profile,
      provider: 'linkedin'
    };

    await done(null, user);
  }
}
