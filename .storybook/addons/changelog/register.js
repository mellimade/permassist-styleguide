import React from 'react';
import { AddonPanel, Description } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

addons.register('storybook/changelog', () => {
  addons.add('changelog/panel', {
    title: "What's new?",
    type: types.PANEL,
    render: ({ active, key }) => {
      const changelog = useParameter('changelog', null) || 'Nothing to update';

      return (
        <AddonPanel key={key} active={!!active}>
          <div style={{ margin: 15 }}>
            <Description markdown={changelog} />
          </div>
        </AddonPanel>
      );
    }
  });
});
