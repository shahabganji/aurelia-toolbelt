import { inject, customElement, bindingMode, bindable, containerless } from 'aurelia-framework';
@inject(Element)
@containerless()
@customElement('abt-carousel')
export class CarouselCustomElement {
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public prevControl: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public nextControl: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public prevControlTitle: string = 'Previous';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public nextControlTitle: string = 'Next';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public prevControlClass: string = 'carousel-control-prev-icon';
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public nextControlClass: string = 'carousel-control-next-icon';

  private hasIndicator: boolean = false;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public indicator: number = 0;

  private elementId: string;
  private carousel: Element;
  private innerCarousel: Element;

  constructor(private element: Element) {

  }

  private attached() {
    if (this.indicator > 0) {
      this.hasIndicator = true;
    } else {
      this.hasIndicator = false;
    }

    this.elementId = 'carouselExampleControls';

  }

}