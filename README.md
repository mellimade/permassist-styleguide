# PermAssist Interactive Style Guide
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.2. It was downgraded to Angular 12.2.16

## Technologies
- CSS
  - SCSS pre-processor
  - Bootstrap 5
- Javascript
  - Angular 12
  - NG Prime
  - Typescript and ES6
  - Storybook

## Use as a library (recommended)
This project has been made as an Angular library. 

### Install the library
To include it in your project, do the follow:
1. Copy **lib** directory into the root of your Angular project.
2. In your applications, use `import { PermassistUIModule } from 'lib/permassist-ui';` to include the module and its components.
3. In your angular.json, make sure to change projects.<project>.architect.builder.build.styles array to include `lib/permassist-ui/styles/lib-styles.scss`. If key does not exist, simply add it.

### Updating the library
If you would like to update library from source, do the following:
1. Run `npm run build`
2. Copy **lib** directory into the root of your Angular project.

[More information](https://angular.io/guide/creating-libraries#using-your-own-library-in-applications)

## Use as part of your application
If you are planning to modify the components, you can simply copy the code into your application.

### Copying the Angular components
The code for the Angular components can be copied from: `projects/permassist-ui/src/lib`

### Copying the styles
The code for the styles can be copied from `projects/permassist-ui/styles`. It is highly recommended to not edit the original files however, as SCSS uses inheritance and overrides by default. It is preferred to overrides styles instead.
