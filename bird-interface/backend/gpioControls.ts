'use strict'
import gpiox from "@iiot2k/gpiox"
import {GetIrEnableData, GetIrPinNumData} from "./configUtil.ts"

let gpioLastEnabled : number = -1;

export async function UpdateGpioState(): void {
    if((await GetIrEnableData()) == "1") {
	const activeIrPin : number = +(await GetIrPinNumData());
	if (gpioLastEnabled != activeIrPin){
	    DeinitOld();
	    gpiox.init_gpio(activeIrPin, 3, false);
	    gpioLastEnabled = activeIrPin;
	}
	gpiox.set_gpio(activeIrPin, true);
    }
    else {
	if (gpioLastEnabled >=0) {
	    gpiox.set_gpio(gpioLastEnabled, false);
	}
    }
}

export function DeinitOld(){
    if (gpioLastEnabled >= 0) {
	gpiox.set_gpio(gpioLastEnabled, false);
	gpiox.deinit_gpio(gpioLastEnabled);
    }
}
