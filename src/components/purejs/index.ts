import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';




export function configure(config: FrameworkConfiguration) {

  config
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/clock/index'))
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/mark-down/index'))
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/nprogress/index'))
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/pretty/index'))
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/microlink/index'))
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/scrollup/index'))
    .feature(PLATFORM.moduleName('aurelia-toolbelt/components/purejs/raw-html/index'));
}
