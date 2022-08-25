import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

import { moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ThemeModule } from '../src/app/@theme/theme.module';

export const decorators = [
  moduleMetadata({
    imports: [CommonModule, ThemeModule, BrowserAnimationsModule],
  }),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: { inlineStories: true },
}
