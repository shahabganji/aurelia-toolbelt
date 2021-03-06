import { containerless, customElement } from 'aurelia-framework';
import { bindable } from 'aurelia-templating';
import { bindingMode } from 'aurelia-binding';



@containerless()
@customElement('abt-card-deck')
export class BootstrapCardDeck {

  @bindable({ defaultBindingMode: bindingMode.oneWay }) public style: string;
  @bindable({ defaultBindingMode: bindingMode.oneWay }) public class: string;

}
