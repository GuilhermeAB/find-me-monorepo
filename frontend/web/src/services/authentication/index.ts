import axios from 'axios';

const url = import.meta.env.VITE_APP_AUTH_REQUEST_BASE_URL as string;

// "id": "59e8d259-07a6-494d-8551-b34fdb1f306d",
// "email": "guilhermeabor9@gmail.com",
// "role": "default",
// "status": "unverified",
// "person": {
//   "id": "def38ff3-fbaa-44c4-8bf8-a35f027e42ba",
//   "name": "Guilherme Afonso",
//   "birthDate": "1997-05-03T03:00:00.000Z"
// }

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
  person: Person,
}

export class AuthenticationService {
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
}
