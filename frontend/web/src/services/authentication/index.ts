import axios from 'axios';

const url = import.meta.env.VITE_APP_AUTH_REQUEST_BASE_URL as string;

export enum UserRole {
  Default = 'default',
  admin = 'admin',
}

export enum UserStatus {
  unverified = 'unverified',
  verified = 'verified',
  disabled = 'disabled',
}

export interface Person {
  id: string,
  name: string,
  birthDate: string,
}

export interface User {
  id: string,
  email: string,
  role: string,
  status: UserStatus,
  person: Person,
}

export class AuthenticationService {
  public static async health(): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/health',
      method: 'GET',
    });
  }

  public static async signIn(email: string, password: string, rememberMe?: boolean): Promise<string | undefined> {
    const { data } = await axios<{ value?: string }>({
      baseURL: url,
      url: 'auth/sign-in',
      method: 'POST',
      withCredentials: true,
      data: {
        email,
        password,
        rememberMe,
      },
    });

    return data?.value;
  }

  public static async signOut(): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/sign-out',
      method: 'POST',
      withCredentials: true,
    });
  }

  public static async signUp(email: string, password: string, name: string, birthDate: string): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/create',
      method: 'POST',
      data: {
        email,
        password,
        name,
        birthDate,
      },
    });
  }

  public static async loggedUser(token?: string): Promise<User> {
    const { data } = await axios<{ value: User }>({
      baseURL: url,
      url: 'auth/logged-user',
      method: 'GET',
      withCredentials: true,
      headers: {
        Authentication: token,
      },
    });

    return data.value;
  }

  public static async updatePerson(name: string, birthDate: string): Promise<void> {
    const [birthDay, birthMonth, birthYear] = birthDate.split('/');

    await axios({
      baseURL: url,
      url: 'auth/update-person',
      method: 'PATCH',
      data: {
        name,
        birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      },
      withCredentials: true,
    });
  }

  public static async updatePassword(currentPassword: string, password: string, repeatPassword: string): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/update-password',
      method: 'PATCH',
      data: {
        currentPassword,
        password,
        repeatPassword,
      },
      withCredentials: true,
    });
  }

  public static async activateAccount(code: string): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/verification',
      method: 'POST',
      data: {
        code,
      },
      withCredentials: true,
    });
  }

  public static async activateAccountRequest(): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/verification-request',
      method: 'POST',
      withCredentials: true,
    });
  }

  public static async passwordRecover(email: string, code: string, password: string): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/password-recover',
      method: 'POST',
      data: {
        email,
        code,
        password,
      },
    });
  }

  public static async passwordRecoverRequest(email: string): Promise<void> {
    await axios({
      baseURL: url,
      url: 'auth/password-recover-request',
      method: 'POST',
      data: {
        email,
      },
    });
  }
}
