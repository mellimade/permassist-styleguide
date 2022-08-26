// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { DatepickerComponent } from './datepicker.component';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../theme.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components/Datepicker',
  component: DatepickerComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, ThemeModule, BrowserAnimationsModule],
    }),
    componentWrapperDecorator(story => `<label for="default" class="form-label">Label</label>${story}`),
  ],
  parameters: {
    controls: { include: ['showPredefinedRanges', 'selectionMode'] }
  },
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {...args, ...{ inputId: 'default'}},
});

export const Default = Template.bind({});

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
