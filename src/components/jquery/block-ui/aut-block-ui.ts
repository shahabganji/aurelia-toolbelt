import { JsTools } from './../../../utilities/purejs/jsTools';
import { CssMinifier } from './../../../utilities/purejs/cssMinifier';
import { transient, customElement, inject, containerless, bindable, bindingMode, observable, DOM, singleton } from 'aurelia-framework';

import * as $ from 'jquery';
import 'aureliatoolbelt-thirdparty/jquery.blockUI/jquery.blockUI.js';
import { IAutBlockUIOption } from './aut-block-ui-option';
import { stringify } from 'querystring';


// We save all options per conponent. [id, settings from component, option from plugin, default options]
@singleton()
export class SharedOptions {
  private allOptions: any = {};

  public getOption(id: string): any {
    return this.allOptions[id];
  }

  public setOption(id: string, obj: any) {
    this.allOptions[id] = {
      id: id,
      settings: obj.settings,
      option: obj.option,
      default: obj.default
    };
  }

  public dispose() {
    this.allOptions = {};
  }
}

@customElement('aut-block-ui')
@inject(Element, 'aut-block-ui-option', CssMinifier, JsTools, SharedOptions)
export class JQueryBlockUI {

  @bindable({ defaultBindingMode: bindingMode.oneWay }) public settings: IAutBlockUIOption = null;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) public block: string | boolean = false;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public blockPage: string | boolean = false;

  private content: HTMLDivElement;
  private spinnerMessage: string = null;
  private elementId: string;
  private defaultOption: IAutBlockUIOption = {};
  private allOptions = {};
  private id: string = '';

  // tslint:disable-next-line:max-line-length
  constructor(private element: Element, private option: IAutBlockUIOption, private cssMinifier: CssMinifier, private jsTools: JsTools, private sharedOptions: SharedOptions) {
  }

  // The component has content or not.
  private hasContent() {
    let slot = this.content.innerHTML.replace('<!--slot-->', '').trim();
    if (slot.length > 0) {
      return true;
    }
    return false;
  }

  private afterAttached() {
    this.id = this.content.id;
    this.elementId = `#${this.id}`;

    if (this.blockPage && this.hasContent()) {
      throw Error('You can not use the [aut-block-ui] with [block-page] property, while you have defined a content inside it.');
    }

    this.setDefaultOption();
    // We add a unique class name per component.
    this.defaultOption.blockMsgClass += ` m${this.id}`;
    // We save all options per component in a singleton class.
    this.sharedOptions.setOption(this.id, {
      id: this.id,
      settings: this.settings || {},
      option: this.option || {},
      default: this.defaultOption
    });


    this.blockChanged(this.block);
    this.blockPageChanged(this.blockPage);

  }

  // Default options comes from http://malsup.com/jquery/block/#options
  private setDefaultOption() {
    this.defaultOption.allowBodyStretch = true;
    this.defaultOption.draggable = true;
    this.defaultOption.css = {
      padding: '0',
      margin: '0',
      width: '30%',
      top: '45%',
      left: '35%',
      textAlign: 'center',
      color: '#000',
      border: '3px solid #aaa',
      backgroundColor: '#fff',
      cursor: 'wait'
    };
    this.defaultOption.overlayCSS = {
      backgroundColor: '#000',
      opacity: 0.6,
      cursor: 'wait'
    };
    this.defaultOption.cursorReset = 'default';
    this.defaultOption.iframeSrc = (/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank');
    this.defaultOption.forceIframe = false;
    this.defaultOption.baseZ = 1020;
    this.defaultOption.centerX = true;
    this.defaultOption.centerY = true;
    this.defaultOption.bindEvents = true;
    this.defaultOption.constrainTabKey = true;
    this.defaultOption.fadeIn = 200;
    this.defaultOption.fadeOut = 400;
    this.defaultOption.timeout = 0;
    this.defaultOption.showOverlay = true;
    this.defaultOption.focusInput = true;
    this.defaultOption.quirksmodeOffsetHack = 4;
    this.defaultOption.blockMsgClass = 'blockMsg';
    this.defaultOption.ignoreIfBlocked = false;
    this.defaultOption.message = '<h1>Please wait...</h1>';
    this.defaultOption.useSpinner = true;

  }

  // We set a style for spinner based on color/class, size, z-index
  private setSpinnerStyle(id: string, option: any) {
    let unit: string = this.getSizeUnit(option.spinnerSize);
    let size: number = this.getSize(option.spinnerSize);

    let isClass = false;
    let spinnerBgColor = '';
    if (option.spinnerColor) {
      isClass = option.spinnerColor.indexOf('.') > -1;
      if (isClass) {
        spinnerBgColor = 'bg-' + option.spinnerColor.replace('.', '');
      } else {
        spinnerBgColor = `background-color: ${option.spinnerColor || '#92459B'} !important`;
      }
    } else {
      spinnerBgColor = 'bg-primary';
      isClass = true;
    }

    let minify = `
    .blockElement.${'m' + id}{
      z-index: ${option.baseZ} !important;
    }
    .blockPage.${'m' + id}{
      z-index: ${option.baseZ} !important;
    }
    .${'b' + id} {
      width: ${size}${unit} !important;
      height: ${size}${unit} !important;
      ${!isClass ? spinnerBgColor : ''}
    }`;
    DOM.injectStyles(this.cssMinifier.minify(minify), null, null, 's' + id);

    // tslint:disable-next-line:max-line-length
    this.spinnerMessage = `<div class="bounce"><div class="bounce1 ${isClass ? spinnerBgColor : ''} ${'b' + id}"></div><div class="bounce2 ${isClass ? spinnerBgColor : ''} ${'b' + id}"></div><div class="bounce3 ${isClass ? spinnerBgColor : ''} ${'b' + id}"></div></div>`;
  }

  private blockChanged(isBlocked: boolean | string) {
    let option: any;
    let merged = this.sharedOptions.getOption(this.id);
    if (merged) {
      // We merged all options here.
      option = Object.assign({}, merged.default, merged.option, merged.settings);
    }
    if (!this.jsTools.isEmpty(option) && option.useSpinner) {
      // Set spinner style when useSpinner is true.
      this.setSpinnerStyle(this.id, option);
      option.css = {
        border: 'none',
        backgroundColor: 'transparent'
      };
      option.message = this.spinnerMessage;
      option.overlayCSS = {
        backgroundColor: '#CCCCCC'
      };
    }
    if (isBlocked) {
      $(this.elementId).block(option);
      this.element.classList.add('block-ui-content');
      // Set options when browser windows resize.
      $(window).resize(() => {
        if (this.element.classList.contains('block-ui-content')) {
          $(this.elementId).block(option);
        }
      });
    } else {
      $(this.elementId).unblock();
      this.element.classList.remove('block-ui-content');
    }
  }

  private blockPageChanged(isBlocked: boolean | string) {
    if (this.blockPage && this.hasContent()) {
      throw Error('You can not use the [aut-block-ui] with [block-page] property, while you have defined a content inside it.');
    }
    let option: any;
    let merged = this.sharedOptions.getOption(this.id);
    if (merged) {
      option = Object.assign({}, merged.default, merged.option, merged.settings);
    }
    if (!this.jsTools.isEmpty(option) && option.useSpinner) {
      this.setSpinnerStyle(this.id, option);
      option.css = {
        border: 'none',
        backgroundColor: 'transparent'
      };
      option.message = this.spinnerMessage;
      option.overlayCSS = {
        backgroundColor: '#CCCCCC'
      };
    }
    if (isBlocked) {
      $.blockUI(option);
    } else {
      $.unblockUI();
    }
  }

  private getSizeUnit(text: string): string {
    if (!text) {
      return 'px';
    }
    let unit = text.replace(/[0-9]/g, '').replace('.', '');
    if (unit === '') {
      unit = 'px';
    }
    return unit;
  }

  private getSize(text: string) {
    if (!text) {
      return 12;
    }
    let unit = this.getSizeUnit(text);
    let size = Number(text.replace(unit, '').trim());
    return size;
  }

  private detached() {
    $.unblockUI();
    $(this.content).unblock();
    this.sharedOptions.dispose();
  }
}
