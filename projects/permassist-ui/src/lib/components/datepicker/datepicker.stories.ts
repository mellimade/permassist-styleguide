// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PermassistUIModule } from '../../permassist-ui.module';
import { DatepickerComponent } from './datepicker.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components/Datepicker',
  component: DatepickerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, PermassistUIModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator(story => `<label for="default" class="form-label">Label</label>${story}`),
  ],
  parameters: {
    controls: { include: ['showPredefinedRanges', 'selectionMode', 'clearable', 'placeholder'] },
    changelog: `
## September 14, 2022
- Added: Placeholder support
- Other: Styles are now namespaced to .-pa-ui

## September 13, 2022
- Added: Supports form control

## September 10, 2022
- Added: Ability to clear input from pop-up
- Fixed: Range hover should now work after a month change
- Other: Downgraded from Angular 14 to 12
- Other: Works with strict typing
`
  },
  argTypes: {
    selectionMode: {
      options: ['single', 'range'],
      control: { type: 'radio' },
    },
    changed: { action: 'changed' }
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args

const Template: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {...args, ...{ inputId: 'default' }},
});

export const Default = Template.bind({});
Default.args = {
  selectionMode: 'single'
};

export const Range = Template.bind({});
Range.args = {
  selectionMode: 'range'
};

// Primary.args = {
//   primary: true,
//   label: 'Button',
// };

// export const Secondary = Template.bind({});
// Secondary.args = {
//   label: 'Button',
// };

// export const Large = Template.bind({});
// Large.args = {
//   size: 'large',
//   label: 'Button',
// };

// export const Small = Template.bind({});
// Small.args = {
//   size: 'small',
//   label: 'Button',
// };
