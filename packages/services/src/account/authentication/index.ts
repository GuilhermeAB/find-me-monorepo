import { CacheService } from '@find-me/cache';
import { DateVO } from '@find-me/date';
import { AccountEntity, AccountRole, AccountStatus } from '@find-me/entities';
import { Status, ValidationError } from '@find-me/errors';
import { UUID } from '@find-me/uuid';
import { randomBytes, scryptSync } from 'crypto';
import { sign, verify } from 'jsonwebtoken';

export interface TokenBody {
  accountId: string,
  personId: string,
  tokenId: string,
  role: AccountRole,
  status: AccountStatus,
  createdAt: Date,
  revocationDate: Date,
}

const BLOCKLIST_CACHE_FOLDER = 'blocklist';

export class Authentication {
  private static generateTokenId(accountId: string, hashToken: string): string {
    const prefix = accountId.substring(1, 4);
    const salt = randomBytes(32).toString('hex');
    const token = scryptSync(`${prefix}${hashToken}`, salt, 128).toString('hex');

    return `${token}.${salt}`;
  }

  public static generateToken(account: AccountEntity): string {
    const {
      AUTHENTICATION_SECRET_TOKEN_HASH,
      AUTHENTICATION_SECRET_TOKEN_TIMEOUT,
      AUTHENTICATION_SECRET_TOKEN_TIMEOUT_HOURS,
    } = process.env;

    if (!AUTHENTICATION_SECRET_TOKEN_HASH || !AUTHENTICATION_SECRET_TOKEN_TIMEOUT || !AUTHENTICATION_SECRET_TOKEN_TIMEOUT_HOURS) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    const {
      id,
      status,
      role,
      person,
    } = account.getProps();

    const body: TokenBody = {
      accountId: id.value,
      personId: person instanceof UUID || typeof person === 'string' ? UUID.generate(person).value : person.getProps().id.value,
      tokenId: Authentication.generateTokenId(id.value, AUTHENTICATION_SECRET_TOKEN_HASH),
      role,
      status,
      createdAt: DateVO.now().value,
      revocationDate: DateVO.now().addHours(Number(AUTHENTICATION_SECRET_TOKEN_TIMEOUT_HOURS)).value,
    };

    const token = sign(
      body,
      AUTHENTICATION_SECRET_TOKEN_HASH,
      {
        algorithm: 'HS256',
        expiresIn: AUTHENTICATION_SECRET_TOKEN_TIMEOUT,
      },
    );

    return token;
  }

  public static parseToken(token: string): TokenBody {
    const {
      AUTHENTICATION_SECRET_TOKEN_HASH,
    } = process.env;

    if (!AUTHENTICATION_SECRET_TOKEN_HASH) {
      throw new ValidationError({ key: 'InvalidEnv' });
    }

    try {
      const payload = verify(token, AUTHENTICATION_SECRET_TOKEN_HASH);
      if (!payload || typeof payload === 'string') {
        throw new ValidationError({ key: 'InvalidToken' });
      }

      // TODO: Verify tokenId
      return payload as TokenBody;
    } catch (e) {
      throw new ValidationError({ key: 'InvalidToken' });
    }
  }

  public static async authenticate(value?: Record<string, string | string[] | undefined>): Promise<TokenBody> {
    if (!value?.authentication) {
      throw new ValidationError({
        key: 'AuthenticationRequired',
        status: Status.Unauthorized,
      });
    }

    const token = Authentication.parseToken(value.authentication as string);
    const cache = new CacheService();

    const exists = await cache.exists(`${BLOCKLIST_CACHE_FOLDER}:${token.tokenId}`);
    if (exists) {
      throw new ValidationError({
        key: 'AuthenticationRequired',
        status: Status.Unauthorized,
      });
    }

    return token;
  }

  public static async signOut(token: TokenBody): Promise<void> {
    const cache = new CacheService();

    await cache.add(`${BLOCKLIST_CACHE_FOLDER}:${token.tokenId}`, token.revocationDate.toString(), token.revocationDate);
  }
}
