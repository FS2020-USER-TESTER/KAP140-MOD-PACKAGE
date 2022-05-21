"use strict";
/* eslint-disable */
class KAP140 extends BaseInstrument {
    constructor() {
        super();
        this.blinkCounter = 0;
        this.RollMode = 0;
        this.PitchMode = 0;
        this.RightBlockReinitTime = 0;
        this.RightBlockCurrDisplay = 0;
        this.bAvionicsPowerOn = false;
        this.iTestingStep = -1;
        this.fCurrentStepDuration = 0.0;
        this.tTestingStepsTime = [2000, 1200, 3200, 4000, 3200]; //in ms (+/- .5sec) - Last Step is everything lit
        this.BaroMode = 0;
        this.g1000NxiActive = false;
        this.g1000NxiNotified = false;
        this.targetVS = 0;
        this.lastAPon = 0;
        this.lastALTon = 0;
        this.lastVS = 0;
        this.forceAPoff = 0;
    }
    get templateID() { return 'KAP140'; }
    connectedCallback() {
        super.connectedCallback();
        RegisterViewListener('JS_LISTENER_KEYEVENT');
        console.log("KAP140 MOD - initialized");     //JB
        this.PTDisplay = this.getChildById('PTDisplay');
        this.UPArrow = this.getChildById('UPArrow');
        this.DownArrow = this.getChildById('DownArrow');
        this.APdisplay = this.getChildById('APDisplay');
        this.LeftDisplayTop = this.getChildById('LeftDisplayTop');
        this.LeftDisplayBot = this.getChildById('LeftDisplayBot');
        this.MidDisplayTop = this.getChildById('MidDisplayTop');
        this.MidDisplayBot = this.getChildById('MidDisplayBot');
        this.LeftARM = this.getChildById('ARMLeft');
        this.MidARM = this.getChildById('ARMMid');
        this.RightBlock = this.getChildById('RightBlock');
        this.RightDisplayTop = this.getChildById('RightDisplayTop');
        this.AlertDisplay = this.getChildById('Alert');
        this.setAutopilotInstalledSimvar(false);
    }
    disconnectedCallback() {
        //window.console.log("KAP140 - destroyed");
        super.disconnectedCallback();
    }
    onInteractionEvent(_args) {
        if (this.isElectricityAvailable()) {
            switch (_args[0]) {     //These events are executed when the mouse pushes button on html KAP140 display
                //
                case 'KAP140_Push_AP':
                    SimVar.SetSimVarValue('K:AP_MASTER', 'number', 0);      // toggle AP on or off
                    break;
                case 'KAP140_Push_HDG':
                    if (SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool')) {
                        if (SimVar.GetSimVarValue('AUTOPILOT HEADING LOCK', 'Bool')) {
                            SimVar.SetSimVarValue('K:AP_HDG_HOLD_OFF', 'number', 0);
                        }
                        else {
                            SimVar.SetSimVarValue('K:AP_HDG_HOLD_ON', 'number', 0);
                        }
                    }
                    else {               //force Display on to match behavior of sim event
                        SimVar.SetSimVarValue('K:AP_MASTER', 'number', 0);
                        SimVar.SetSimVarValue('K:AP_HDG_HOLD_ON', 'number', 0);
                    }
                    break;
                case 'KAP140_Push_NAV':
                    if (SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool')) {
                        SimVar.SetSimVarValue('K:AP_NAV1_HOLD', 'number', 0);
                    }
                    break;
                case 'KAP140_Push_APR':
                    if (SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool')) {
                        SimVar.SetSimVarValue('K:AP_APR_HOLD', 'number', 0);
                    }
                    break;
                case 'KAP140_Push_REV':
                    if (SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool')) {
                        SimVar.SetSimVarValue('K:AP_BC_HOLD', 'number', 0);
                    }
                    break;
                case 'KAP140_Push_ALT':
                    if (SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool')) {
                        if (SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK', 'Bool')) {
                            SimVar.SetSimVarValue('K:AP_PANEL_VS_ON', 'number', 0);
                        }
                        else {
                            SimVar.SetSimVarValue('K:AP_ALT_HOLD', 'number', 0);
                        }
                    }
                    break;
                case 'KAP140_Push_UP':
                    if (SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK', 'Bool')) {
                        //Coherent.call('AP_ALT_VAR_SET_ENGLISH', 2, SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK VAR', 'feet') + 100, false);
                        SimVar.SetSimVarValue('K:AP_ALT_VAR_INC', 'number', 100);
                    }
                    else {
                        if (this.RightBlockCurrDisplay != 1) {
                            this.RightBlockCurrDisplay = 1;
                        }
                        else {
                            SimVar.SetSimVarValue('K:AP_VS_VAR_INC', 'number', 0);
                            this.targetVS = this.targetVS + 100;
                        }
                    }
                    this.RightBlockReinitTime = 3000;
                    break;
                case 'KAP140_Push_DN':
                    if (SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK', 'Bool')) {
                       //Coherent.call('AP_ALT_VAR_SET_ENGLISH', 2, SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK VAR', 'feet') - 100, false);
                       SimVar.SetSimVarValue('K:AP_ALT_VAR_DEC', 'number', 100);
                    }
                    else {
                        if (this.RightBlockCurrDisplay != 1) {
                            this.RightBlockCurrDisplay = 1;
                        }
                        else {
                            SimVar.SetSimVarValue('K:AP_VS_VAR_DEC', 'number', 0);
                            this.targetVS = this.targetVS - 100;
                        }
                    }
                    this.RightBlockReinitTime = 3000;
                    break;
                case 'KAP140_Push_BARO':
                    this.RightBlockReinitTime = 3000;
                    this.RightBlockCurrDisplay = 2;
                    break;
                case 'KAP140_Long_Push_BARO':
                    this.RightBlockReinitTime = 3000;
                    this.RightBlockCurrDisplay = 2;
                    this.BaroMode = 1 - this.BaroMode;
                    break;
                case 'KAP140_Push_ARM':
                    break;
                case 'KAP140_Knob_Outer_INC':
                case 'KAP140_Knob_Outer_DEC':
                case 'KAP140_Knob_Inner_INC':
                case 'KAP140_Knob_Inner_DEC':
                    if (this.RightBlockCurrDisplay == 1) {
                        this.RightBlockReinitTime = 0;
                        this.RightBlockCurrDisplay = 0;
                    }
                    if (this.RightBlockCurrDisplay == 2) {
                        this.RightBlockReinitTime = 3000;
                        switch (_args[0]) {
                            case 'KAP140_Knob_Inner_INC':
                            case 'KAP140_Knob_Outer_INC':
                                SimVar.SetSimVarValue('K:KOHLSMAN_INC', 'number', 2);
                                break;
                            case 'KAP140_Knob_Outer_DEC':
                            case 'KAP140_Knob_Inner_DEC':
                                SimVar.SetSimVarValue('K:KOHLSMAN_DEC', 'number', 2);
                                break;
                        }
                    }
                    else {
                        switch (_args[0]) {
                            case 'KAP140_Knob_Outer_INC':
                                SimVar.SetSimVarValue('K:AP_ALT_VAR_INC', 'number', 1000);
                                break;
                            case 'KAP140_Knob_Outer_DEC':
                                SimVar.SetSimVarValue('K:AP_ALT_VAR_DEC', 'number', 1000);
                                break;
                            case 'KAP140_Knob_Inner_INC':
                                SimVar.SetSimVarValue('K:AP_ALT_VAR_INC', 'number', 100);
                                break;
                            case 'KAP140_Knob_Inner_DEC':
                                SimVar.SetSimVarValue('K:AP_ALT_VAR_DEC', 'number', 100);
                                break;
                        }
                    }
                    break;
            }
        }
    }
    Update() {
        super.Update();
        if (!this.g1000NxiActive) {
            this.g1000NxiActive = SimVar.GetSimVarValue("L:WT1000_AP_G1000_INSTALLED", "Boolean");
        }
        if (this.g1000NxiActive && !this.g1000NxiNotified) {
            this.setAutopilotInstalledSimvar(true);
        }
        if (this.isElectricityAvailable()) {
            this.blinkCounter = (this.blinkCounter + this.deltaTime) % 1000000;
            if (!this.bAvionicsPowerOn) {
                this.bAvionicsPowerOn = true;
                this.iTestingStep = 0;
                this.fCurrentStepDuration = this.tTestingStepsTime[this.iTestingStep] + Math.random() * 500;
                LaunchFlowEvent('AUTOPILOT_PREFLIGHT_CHECK_START');
                SimVar.SetSimVarValue('L:AutopilotPreflightCheckCompleted', 'Boolean', 0);
            }
            else {
                if (this.iTestingStep >= 0) {
                    this.fCurrentStepDuration -= this.deltaTime;
                    if (this.fCurrentStepDuration <= 0.0) {
                        this.fCurrentStepDuration = this.tTestingStepsTime[this.iTestingStep++] + Math.random() * 500;
                        if (this.iTestingStep >= this.tTestingStepsTime.length) {
                            this.iTestingStep = -1;
                            LaunchFlowEvent('AUTOPILOT_PREFLIGHT_CHECK_OVER');
                            SimVar.SetSimVarValue('L:AutopilotPreflightCheckCompleted', 'Boolean', 1);
                            //Reset everything
                            this.HideEveryDisplay();
                            this.RightDisplayTop.style.visibility = 'visible';
                            this.LeftDisplayTop.style.visibility = 'visible';
                            this.LeftDisplayBot.style.visibility = 'visible';
                            this.MidDisplayTop.style.visibility = 'visible';
                            this.MidDisplayBot.style.visibility = 'visible';
                            this.RightDisplayTop.style.visibility = 'visible';
                            this.RightDisplayTop.classList.remove('alignLeft');
                        }
                    }
                }
            }
            // Testing Mode
            //On last step - just light up everything
            if (this.iTestingStep == this.tTestingStepsTime.length - 1) {
                this.ShowEveryDisplay();
                diffAndSetText(this.LeftDisplayTop, '888');
                diffAndSetText(this.LeftDisplayBot, '888');
                diffAndSetText(this.MidDisplayTop, '888');
                diffAndSetText(this.MidDisplayBot, '888');
                diffAndSetText(this.RightDisplayTop, 'V1.0W');     //show version
                this.PTDisplay.style.textAlign = 'center';          //improve readability of PT message
                this.PTDisplay.style.fontWeight = 'bolder';
                diffAndSetText(this.UPArrow, '/\\');                //msfs does not correctly display arrow unicode
                diffAndSetText(this.DownArrow, '\\/');              //so create work-around arrow from slashes
                return;
            }
            // On other steps, display PFT <StepNumber>
            else if (this.iTestingStep > -1) {
                this.HideEveryDisplay();
                this.MidDisplayTop.style.visibility = 'visible';
                diffAndSetText(this.MidDisplayTop, 'PFT');
                this.RightDisplayTop.style.visibility = 'visible';
                diffAndSetText(this.RightDisplayTop, fastToFixed((this.iTestingStep + 1), 0));
                this.RightDisplayTop.classList.add('alignLeft');
                return;
            }
            // Autopilot engaged
            if (this.isAutopilotEngaged()) {
                this.APdisplay.style.visibility = 'visible';
            }
            else {
                this.APdisplay.style.visibility = 'hidden';
            }
            /////////////////
            // Look for AP mode change shince last update
            if(this.forceAPoff) {
                SimVar.SetSimVarValue('K:AP_VS_OFF', 'number', 0);      
                SimVar.SetSimVarValue('K:AUTOPILOT_OFF', 'number', 0);      //Testing AP on ground has trim bugs - force off
                this.forceAPoff = 0;
                return;
            }
            const apOnNow = SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool');
            if (apOnNow != this.lastAPon) {           //Autopilot went on or off?
                this.lastAPon = apOnNow;
                if (apOnNow) {
                    //AP just turned on, check for on ground
                    if( SimVar.GetSimVarValue("SIM ON GROUND", "bool") == 0){
                        this.startAP();                 //not on ground - do startup checks
                    }
                    else                //started AP on ground - leads to bugs
                    {
                        this.forceAPoff = 1;    //off now ignored, need to force off in next update cycle
                        return;
                    }
                    this.RightBlockReinitTime = 3000;
                    this.RightBlockCurrDisplay = 1;
                }
                else 
                {                                                       //AP just turned off
                    SimVar.SetSimVarValue('K:AP_HDG_HOLD_OFF', 'number', 0);   //clear HDG mode if on
                    SimVar.SetSimVarValue('K:AP_NAV1_HOLD_OFF', 'number', 0);  //and NAV mode
                    SimVar.SetSimVarValue('K:AP_APR_HOLD_OFF', 'number', 0);   //and APR
                    SimVar.SetSimVarValue('K:AP_BC_HOLD_OFF', 'number', 0);    //and BC
                    this.RightBlockCurrDisplay = 0;
                    this.lastALTon = 0;
                    this.lastVS = 0;
                }
            }
            
            //////Did AP enter ALT Mode?
            const altOnNow = SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK', 'Bool');
            if (altOnNow != this.lastALTon) {     //did ALT HLD just turn on or off?
                this.lastALTon = altOnNow;
                if (altOnNow) {
                    //var altNow = SimVar.GetSimVarValue('INDICATED ALTITUDE:2', 'feet');
                    //altNow = Math.round(altNow);
                    
                    this.RightBlockCurrDisplay = 0;
                    this.RightBlockReinitTime = 0;
                }
                 else {                                         //ALT hold just ended
                     this.RightBlockReinitTime = 3000;
                     this.RightBlockCurrDisplay = 1;         //just went to VS, show correct display

                }
            }
            ///////////////////// VS VAR CHanged?
            const vsNow = SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD VAR', 'feet per minute');
            if(altOnNow){
                this.lastVS = vsNow;        //in ALT mode keep lastVS updated (VS automatically ramps down during capture)
            }
            else {                
                if(vsNow != this.lastVS){           //make display cover case where VS changed by external control
                    this.lastVS = vsNow;
                    this.RightBlockCurrDisplay = 1;
                    this.RightBlockReinitTime = 3000;
                }
            }
            ///////////////
            // Roll Mode
            diffAndSetText(this.LeftDisplayTop, this.getActiveRollMode());
            if(this.RollMode == 6){                     //fell into Bank Hold Mode, try for wing leveler
                SimVar.SetSimVarValue("K:AP_BANK_HOLD", "number", 0);
                SimVar.SetSimVarValue("K:AP_WING_LEVELER", "number", 1);
                diffAndSetText(this.LeftDisplayTop, this.getActiveRollMode());
            }
            const armedRoll = this.getArmedRollMode();
            diffAndSetText(this.LeftDisplayBot, armedRoll);
            if (armedRoll) {
                this.LeftARM.style.visibility = 'visible';
            }
            else {
                this.LeftARM.style.visibility = 'hidden';
            }
            // Pitch mode
            diffAndSetText(this.MidDisplayTop, this.getActivePitchMode());
            const armedPitch = this.getArmedPitchMode();
            diffAndSetText(this.MidDisplayBot, armedPitch);
            if (armedPitch) {
                this.MidARM.style.visibility = 'visible';
            }
            else {
                this.MidARM.style.visibility = 'hidden';
            }
            //Right Display
            SimVar.SetSimVarValue('L:KAP140_BARO_Display', 'Bool', this.RightBlockCurrDisplay == 2 ? 1 : 0);
            if (this.RightBlockReinitTime > 0) {
                this.RightBlockReinitTime -= this.deltaTime;
                if (this.RightBlockReinitTime <= 0) {
                    this.RightBlockReinitTime = 0;
                    this.RightBlockCurrDisplay = 0;
                }
                else if (this.RightBlockCurrDisplay == 1) {
                    diffAndSetAttribute(this.RightBlock, 'state', 'FPM');
                    diffAndSetText(this.RightDisplayTop, this.getVerticalSpeedSelected());
                }
                else if (this.RightBlockCurrDisplay == 2) {
                    if (this.BaroMode == 0) {
                        diffAndSetAttribute(this.RightBlock, 'state', 'HPA');
                        diffAndSetText(this.RightDisplayTop, this.getBaroHPa());
                    }
                    else {
                        diffAndSetAttribute(this.RightBlock, 'state', 'INHG');
                        diffAndSetText(this.RightDisplayTop, this.getBaroInHg());
                    }
                }
            }
            
            if (this.RightBlockCurrDisplay == 0) {
                diffAndSetAttribute(this.RightBlock, 'state', 'FT');
                diffAndSetText(this.RightDisplayTop, this.getAltitudeSelected());
            }
            //Alert
            const differenceToObj = this.getAltitudeDifference();
            if (differenceToObj >= 100  && differenceToObj <= 1000) {
                this.AlertDisplay.style.visibility = 'visible';
            }
            else {
                this.AlertDisplay.style.visibility = 'hidden';
            }
            //PT Display
            const pitchMode = this.getActivePitchMode();
            const neededTrim = this.getNeededTrim();
            const hidden = (this.blinkGetState(600, 300) ? false : true);
            if (neededTrim < -100 && pitchMode != '') {
                //this.PTDisplay.classList.toggle('hide', hidden);
                //this.UPArrow.classList.toggle('hide', hidden);
                if(hidden){
                    this.PTDisplay.style.visibility = 'visible';
                    this.UPArrow.style.visibility = 'visible';
                    this.DownArrow.style.visibility = 'hidden';
                }
                else{
                    this.PTDisplay.style.visibility = 'hidden';
                    this.UPArrow.style.visibility = 'hidden';
                    this.DownArrow.style.visibility = 'hidden';
                }
                //console.log('pitchMode '+pitchMode+' neededtrim '+neededTrim+' hidden '+hidden);
            }
            else if (neededTrim > 100 && pitchMode != '') {
                //this.PTDisplay.classList.toggle('hide', hidden);
                //this.DownArrow.classList.toggle('hide', hidden);                
                if(hidden){
                    this.PTDisplay.style.visibility = 'visible';
                    this.UPArrow.style.visibility = 'hidden';
                    this.DownArrow.style.visibility = 'visible';
                }
                else{
                    this.PTDisplay.style.visibility = 'hidden';
                    this.UPArrow.style.visibility = 'hidden';
                    this.DownArrow.style.visibility = 'hidden';
                }
            }
            else {
                this.PTDisplay.style.visibility = 'hidden';
                this.UPArrow.style.visibility = 'hidden';
                this.DownArrow.style.visibility = 'hidden';
            }
        }
        else {
            if (this.bAvionicsPowerOn) {
                this.HideEveryDisplay();
                this.bAvionicsPowerOn = false;
            }
        }
    }
    HideEveryDisplay() {
        this.LeftDisplayTop.style.visibility = 'hidden';
        this.LeftDisplayBot.style.visibility = 'hidden';
        this.MidDisplayTop.style.visibility = 'hidden';
        this.MidDisplayBot.style.visibility = 'hidden';
        this.RightDisplayTop.style.visibility = 'hidden';
        this.APdisplay.style.visibility = 'hidden';
        this.LeftARM.style.visibility = 'hidden';
        this.MidARM.style.visibility = 'hidden';
        this.AlertDisplay.style.visibility = 'hidden';
        this.PTDisplay.style.visibility = 'hidden';
        this.UPArrow.style.visibility = 'hidden';
        this.DownArrow.style.visibility = 'hidden';
        diffAndSetAttribute(this.RightBlock, 'state', 'NONE');
    }
    ShowEveryDisplay() {
        this.LeftDisplayTop.style.visibility = 'visible';
        this.LeftDisplayBot.style.visibility = 'visible';
        this.MidDisplayTop.style.visibility = 'visible';
        this.MidDisplayBot.style.visibility = 'visible';
        this.RightDisplayTop.style.visibility = 'visible';
        this.APdisplay.style.visibility = 'visible';
        this.LeftARM.style.visibility = 'visible';
        this.MidARM.style.visibility = 'visible';
        this.AlertDisplay.style.visibility = 'visible';
        this.PTDisplay.style.visibility = 'visible';
        this.UPArrow.style.visibility = 'visible';
        this.DownArrow.style.visibility = 'visible';
        diffAndSetAttribute(this.RightBlock, 'state', 'ALL');
    }
    startAP() {
        // When autopilot is enabled, capture that vertical speed and allow the plane to travel that direction forever.
        const defPitch = SimVar.GetSimVarValue('AUTOPILOT DEFAULT PITCH MODE', 'Enum');
        const wlevel = SimVar.GetSimVarValue('AUTOPILOT WING LEVELER', 'Bool');
        const fpm = SimVar.GetSimVarValue("VERTICAL SPEED", "feet per second") * 60.0;

        if(!wlevel){                                    //if wing leveler is off, force on
            //console.log('Force Wing Leveler Mode ');
            SimVar.SetSimVarValue("K:AP_BANK_HOLD", "number", 0);
            SimVar.SetSimVarValue("K:AP_WING_LEVELER", "number", 1);
                }

        if(defPitch != 3){                              //if plane is not configured to capture VS, force a reasonable value
            this.targetVS = this.getValidatedVS(fpm);
            SimVar.SetSimVarValue("K:AP_PANEL_VS_ON", "number", 0);
            SimVar.SetSimVarValue("K:AP_VS_VAR_SET_ENGLISH", "number", this.targetVS);
            //this.AltitudeArmed = false;
        }
        this.lastVS = SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD VAR', 'feet per minute');
    }
    getValidatedVS(currVSpeed) {
        // what happens in real AP when vs is outside of limits?
        // VS limits could be dependant on aircraft type:
        currVSpeed = Math.round(currVSpeed / 100.0) * 100.0;        //round VS to nearest 100
        if (currVSpeed < -1500.0) {                             //reasonable limits
            currVSpeed = -1500;
        }
        if (currVSpeed > 700.0) {
            currVSpeed = 700;
        }
        return currVSpeed;
    }
    getReasonableAltitudeValue() {
        return SimVar.GetSimVarValue("INDICATED ALTITUDE:2", "feet") + 1000;
    }
    isAutopilotEngaged() {
        return SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool');
    }
    getActiveRollMode() {
        if (SimVar.GetSimVarValue('AUTOPILOT MASTER', 'Bool')) {
            if (SimVar.GetSimVarValue('AUTOPILOT WING LEVELER', 'Bool')) {
                this.RollMode = 1;
                return 'ROL';
            }
            else if (SimVar.GetSimVarValue('AUTOPILOT HEADING LOCK', 'Bool')) {
                this.RollMode = 2;
                return 'HDG';
            }
            else if (SimVar.GetSimVarValue('AUTOPILOT NAV1 LOCK', 'Bool')) {
                this.RollMode = 3;
                if(SimVar.GetSimVarValue('GPS DRIVES NAV1', 'Bool')){
                    return 'GPS';
                }
                else
                {
                    return 'NAV';
                }
            }
            else if (SimVar.GetSimVarValue('AUTOPILOT BACKCOURSE HOLD', 'Bool')) {
                this.RollMode = 4;
                return 'REV';
            }
            else if (SimVar.GetSimVarValue('AUTOPILOT APPROACH HOLD', 'Bool')) {
                this.RollMode = 5;
                return 'APR';
            }
            else if (SimVar.GetSimVarValue('AUTOPILOT BANK HOLD', 'Bool')) {
                this.RollMode = 6;
                return '---';
            }
        }
        this.RollMode = 0;
        return '';
    }
    getArmedRollMode() {
        if (!SimVar.GetSimVarValue('AUTOPILOT HEADING LOCK', 'Bool') && !SimVar.GetSimVarValue('AUTOPILOT WING LEVELER', 'Bool')) {
            return '';
        }
        else if (SimVar.GetSimVarValue('AUTOPILOT NAV1 LOCK', 'Bool')) {
            return 'NAV';
        }
        else if (SimVar.GetSimVarValue('AUTOPILOT BACKCOURSE HOLD', 'Bool')) {
            return 'REV';
        }
        else if (SimVar.GetSimVarValue('AUTOPILOT APPROACH HOLD', 'Bool')) {
            return 'APR';
        }
        return '';
    }
    getActivePitchMode() {
        if (SimVar.GetSimVarValue('AUTOPILOT GLIDESLOPE ACTIVE', 'Boolean')) {
            this.PitchMode = 3;
            return 'GS';
        }
        if (SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD', 'Bool')) {
            this.PitchMode = 1;
            return 'VS';
        }
        else if (SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK', 'Bool')) {
            this.PitchMode = 2;
            return 'ALT';
        }
        else if (SimVar.GetSimVarValue('AUTOPILOT PITCH HOLD', 'Bool')) {
            this.PitchMode = 0;
            return 'PIT';
        }
        else if (SimVar.GetSimVarValue('AUTOPILOT FLIGHT LEVEL CHANGE', 'Bool')) {
            this.PitchMode = 0;
            return 'FLC';
        }
        this.PitchMode = 0;
        return '';
    }
    getArmedPitchMode() {
        if (SimVar.GetSimVarValue('AUTOPILOT GLIDESLOPE ARM', 'Boolean')) {
            return 'GS';
        }
        if (SimVar.GetSimVarValue('AUTOPILOT ALTITUDE ARM', 'Bool')) {
            return 'ALT';
        }
        //due to core sim bug, 'AUTOPILOT ALTITUDE ARM' is incorrect when in VS mode heading towards the target
        if(SimVar.GetSimVarValue("AUTOPILOT PITCH HOLD", "Bool") || SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "Bool") || SimVar.GetSimVarValue("AUTOPILOT FLIGHT LEVEL CHANGE", "Bool")) {
            // Auto arm mode
            const vs = SimVar.GetSimVarValue("VERTICAL SPEED", "feet per second")*60;
            const currentAltitude = Math.round(SimVar.GetSimVarValue("INDICATED ALTITUDE", "feet"));
            const targetAltitude = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR", "feet");
            if(vs > 10 && targetAltitude > currentAltitude + 100) {
                return 'ALT';
            }
            else if(vs < -10 && targetAltitude < currentAltitude - 100) {
                return 'ALT';
            }
            else if(SimVar.GetSimVarValue("SIM ON GROUND", "bool") && targetAltitude > currentAltitude + 100) {
                return 'ALT';
            }
        }
        return '';
    }
    getAltitudeSelected() {
        return (fastToFixed(SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK VAR', 'feet'), 0)).replace(/\d+(?=(\d{3}))/, '$&,');
    }
    getVerticalSpeedSelected() {
        return (fastToFixed(SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD VAR', 'feet/minute'), 0)).replace(/\d+(?=(\d{3}))/, '$&,');
    }
    getBaroHPa() {
        return (fastToFixed(SimVar.GetSimVarValue('KOHLSMAN SETTING MB:2', 'Millibars'), 0)).replace(/\d+(?=(\d{3}))/, '$&,');
    }
    getBaroInHg() {
        return fastToFixed((Math.round(SimVar.GetSimVarValue('KOHLSMAN SETTING HG:2', 'inHg') * 100) / 100), 2);
    }
    getAltitudeDifference() {
        return Math.abs(SimVar.GetSimVarValue('INDICATED ALTITUDE:2', 'feet') - SimVar.GetSimVarValue('AUTOPILOT ALTITUDE LOCK VAR', 'feet'));
    }
    getNeededTrim() {
        const refVSpeed = SimVar.GetSimVarValue('AUTOPILOT VERTICAL HOLD VAR', 'feet per minute');
        //const currVSpeed = SimVar.GetSimVarValue('VELOCITY WORLD Y', 'feet per minute');
        const currVSpeed = SimVar.GetSimVarValue('VERTICAL SPEED', 'feet per second') * 60;
        return currVSpeed - refVSpeed;
    }
    blinkGetState(_blinkPeriod, _duration) {
        return Math.round(this.blinkCounter / _duration) % (_blinkPeriod / _duration) == 0;
    }
    /**
     * Sets the WT KAP140 Installed Simvar State
     * @param state The value to set the simvar
     */
    setAutopilotInstalledSimvar(state) {
        SimVar.SetSimVarValue("L:WT1000_AP_KAP140_INSTALLED", "Boolean", state);
        this.g1000NxiNotified = state;
    }
}
//**************************************
//THIS IS THE LAST INSTRUCTION
registerInstrument('kap140-element', KAP140);
