import { window as globalWindow } from 'global';
import { addons } from '@storybook/addons';

import TagManager from 'react-gtm-module';

addons.register('storybook/google-tag-manager', () => {
  TagManager.initialize(globalWindow.STORYBOOK_GTM || {});

  console.log('boo');
});
