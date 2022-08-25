// also exported from '@storybook/angular' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/angular/types-6-0';
import { componentWrapperDecorator } from '@storybook/angular';

import { DatepickerComponent } from './datepicker.component';

// More on default export: https://storybook.js.org/docs/angular/writing-stories/introduction#default-export
export default {
  title: 'Components/Datepicker',
  component: DatepickerComponent,
  decorators: [
    // With template
    componentWrapperDecorator(story => `<label for="default" class="form-label">Label</label>${story}`),
  ],
} as Meta;

// More on component templates: https://storybook.js.org/docs/angular/writing-stories/introduction#using-args
const Template: Story<DatepickerComponent> = (args: DatepickerComponent) => ({
  props: {...args, ...{ inputId: 'default'}},
});

export const Default = Template.bind({});

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
