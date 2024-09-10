import { defaultNS } from '../../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: I18NextResources;
  }
}
