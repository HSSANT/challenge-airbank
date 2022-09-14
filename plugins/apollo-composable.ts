import { Context } from "@nuxt/types";
import { onGlobalSetup, defineNuxtPlugin } from "@nuxtjs/composition-api";
// @ts-ignore
import { provideApolloClient } from "@vue/apollo-composable";

/**
 * This plugin will connect @nuxt/apollojs with @vue/apollo-composable
 */

export default defineNuxtPlugin(({ app }: Context): void => {
  onGlobalSetup(() => {
    provideApolloClient(app.apolloProvider?.defaultClient);
  });
});
