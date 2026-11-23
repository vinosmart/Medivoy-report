import { defineStore } from 'pinia';

const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: "",
    isHydrated: false
  }),
  getters: {
    isAdmin: (state) => {
      var _a;
      return ((_a = state.user) == null ? void 0 : _a.role) === "admin";
    },
    isLoggedIn: (state) => Boolean(state.token)
  },
  actions: {
    init() {
    },
    login(user, token) {
      this.user = user;
      this.token = token;
    },
    logout() {
      this.user = null;
      this.token = "";
    }
  }
});

export { useAuthStore as u };
//# sourceMappingURL=auth-DLg6Nzla.mjs.map
