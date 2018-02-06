
export class BootstrapTokenize {

  private selectedData: Array<any>;
  private countries: any[];

  constructor() {
    this.selectedData = [];
    this.countries = [
      { text: 'Argentina', value: 'AR' },
      { text: 'Brazil', value: 'BR' },
      { text: 'Canada', value: 'CA' },
      { text: 'France', value: 'FR' },
      { text: 'Germany', value: 'DE' },
      { text: 'Iran', value: 'IR' },
      { text: 'Netherlands', value: 'NL' },
      { text: 'New Zealand', value: 'NZ' },
      { text: 'Portugal', value: 'PT' },
      { text: 'Spain', value: 'ES' },
      { text: 'Sweden', value: 'SE' },
      { text: 'Switzerland', value: 'CH' },
      { text: 'United Kingdom', value: 'GB' },
      { text: 'United States', value: 'US' }
    ];
  }

  private fill(term: string) {
    let result: any[] = [];
    for (let index = 0; index < this.countries.length; index++) {
      let text = (<string>this.countries[index].text).toLocaleLowerCase();
      if (text.indexOf(term.toLocaleLowerCase()) > -1) {
        result.push(this.countries[index]);
      }
    }
    return result;
  }
  private clear() {
    console.log('clear');
  }
  private onClick() {
    this.selectedData.push({ value: Math.random(), text: 'Test - ' + Math.random() });
  }
  private onRemove() {
    this.selectedData.splice(3, 1);
  }

  private search(e: any, v: any) {
    console.log(v);
  }
}
