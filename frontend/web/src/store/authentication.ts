import { defineStore } from 'pinia';
import { User, AuthenticationService } from '../services/authentication';

interface State {
  token?: string,
  user?: User,
}

export const useAuthenticationStore = defineStore('authentication', {
  state: (): State => ({
    token: undefined,
    user: undefined,
  }),
  getters: {
    currentToken: (state) => state.token,
    currentUser: (state) => state.user,
  },
  actions: {
    async loggedUser(): Promise<void> {
      try {
        const user = await AuthenticationService.loggedUser(this.currentToken);

        this.user = user;
      } catch (e) {
        this.user = undefined;
        this.token = undefined;
      }
    },
    async signIn(email: string, password: string, rememberMe?: boolean): Promise<void> {
      const token = await AuthenticationService.signIn(email, password, rememberMe);

      this.token = token;

      await this.loggedUser();
    },
  },
});
