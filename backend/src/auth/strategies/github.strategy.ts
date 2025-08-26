import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('github.clientId'),
      clientSecret: configService.get<string>('github.clientSecret'),
      callbackURL: configService.get<string>('github.callbackUrl'),
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<any> {
    const { id, username, displayName, emails, photos } = profile;
    
    const email = emails && emails.length > 0 ? emails[0].value : null;
    
    if (!email) {
      throw new Error('No email found in GitHub profile');
    }

    const [firstName, ...lastNameParts] = (displayName || username || '').split(' ');
    const lastName = lastNameParts.join(' ') || '';

    return {
      provider: 'github',
      providerId: id,
      email,
      firstName: firstName || username || '',
      lastName: lastName || '',
      avatar: photos && photos.length > 0 ? photos[0].value : null,
      accessToken,
      refreshToken,
    };
  }
}