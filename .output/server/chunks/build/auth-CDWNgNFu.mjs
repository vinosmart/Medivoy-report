import { d as defineNuxtRouteMiddleware, n as navigateTo } from './server.mjs';
import { u as useAuthStore } from './auth-DLg6Nzla.mjs';
import 'vue';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'vue/server-renderer';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';

const auth = defineNuxtRouteMiddleware((to) => {
  const auth2 = useAuthStore();
  if (!auth2.isHydrated && false) ;
  if (!auth2.token && to.path !== "/") return navigateTo("/");
});

export { auth as default };
//# sourceMappingURL=auth-CDWNgNFu.mjs.map
