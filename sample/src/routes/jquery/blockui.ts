import { IAutBlockUIOption } from './../../../../src/components/jquery/block-ui/aut-block-ui-option';


export class Blockui {
    private blockValue1 = false;
    private blockValue2 = true;

    private blockPageOption: IAutBlockUIOption = {};
    private blockOption: IAutBlockUIOption = {};

    private attached() {
        this.blockOption.spinnerSize = '13px';
        this.blockOption.spinnerColor = '.info';

        this.blockPageOption.useSpinner = true;
        this.blockPageOption.spinnerSize = '25px';

    }

    private toggleBlock1() {
        // setInterval(() => { this.blockValue1 = !this.blockValue1; }, 50000);
        this.blockValue1 = !this.blockValue1;
    }
    private toggleBlock2() {
        this.blockValue2 = !this.blockValue2;
    }
}
