Documentation for the KAP140 MOD Package
========================================

\*BETA 5 RELEASE – Software Version 0.105\*
===========================================

This package corrects some issues with the built-in KAP140 autopilot in
<span class="underline">Microsoft Flight Simulator 2020</span>. This
March 2022 Update has many changes and should be considered a rewrite.

Based on concepts in:
<https://github.com/m-chomiczewski/MC_KAP140_MOD/tree/main/mc-kap140>

**INSTALLATION**

Unzip the downloaded release file and copy the directory new-kap140 to
your Community folder.

You may report issues in the github issue list page.

**BACKGROUND**

This MOD is useful for several simulated airplanes using the KAP140
autopilot display. (See tested list below). This KAP140 display is an
HTML/Javascript window to control and monitor the autopilot running in
the simulator core. This MOD provides updated Javascript to correct
operation and adjust display elements to match real-world equipment.

**GOALS**

The goals of this effort are

-   Operation that matches the real-world KAP140 Pilot Guide as much as
    possible

-   Correct display when controlled with Mouse, keyboard, or external
    devices like Honeycomb Bravo. Achieving this goal required rewrite
    of the HTML button press handler.

-   On AP turn-on, the actual KAP140 AP will enter ‘Wing Leveler’ and
    capture the current vertical speed. This behavior can be selected in
    airplanes system.cfg but in case this default is not present in that
    file, the MOD will force this behavior. When forced by Mod, the VS
    is restricted to be between +700 to -1500.

**VERSION DISPLAY**

The MOD displays current version in the last page of the power-on
test.

**KNOWN ISSUES **

1.  The real KAP140 shows blinking ‘AP’ display for several seconds when
    autopilot is turned off. This is not yet modeled.

2.  The KAP140 Baro button allows edit of the AP barometer however the
    selection of which altitude instrument the AP uses is under the
    control of the aircraft provider using altimeter\_indicator setting
    in system.cfg and is not overridden by the KAP140 MOD. In default
    mapping, the “B” key may be used to sync all the altimeters with sim
    actual.

3.  If autopilot is in VS mode with a non-zero vertical speed value,
    choosing a new altitude target with the rotary knobs will cause the
    AP to switch from VS to ALT if the target altitude displayed
    momentarily equals the current aircraft altitude. To avoid this,
    enable ALT mode, use knob to adjust to a new altitude target, then
    change mode from ALT to VS and select a vertical speed in the
    desired direction. Target altitude may also be set with AP off.

4.  When selecting altitude hold mode, the MSFS core autopilot will
    round the held altitude to the nearest 100 feet.

5.  When using rotary knobs to choose a new target altitude in ALT mode,
    the ALT ARM display value will correctly illuminate. However, when
    exiting altitude hold into vertical speed mode, the ALT Arm display
    will disappear. This is due to incorrect 0 value returned by core
    autopilot for sim variable “AUTOPILOT ALTITUDE ARM”. The autopilot
    is actually correctly armed and will capture the set target and enter
    ALT mode if VS is used to command a change in altitude in the
    correct direction.

6.  If the AP is turned on while plane is parked or on runway as part of
    a test procedure, the trim may run to full nose down or up. If the pilot
    does not recheck trim and correct prior to take-off roll this will
    result in plane being uncontrollable. For this reason, the on-screen
    AP button press by mouse will be ignored at low airspeed. When
    AP engaged with external control at low airspeed, the MOD will disengage. 
    Testing AP on the ground should not be performed with current version
    of Microsoft Flight Simulator.

7.  When in ALT hold mode, if the target altitude is modified, and then
    a keyboard or a mapped external control is used to increment or
    decrement vertical speed, the core AP will modify its vertical speed
    with ALT mode indicated. This is not possible in the real KAP140 and
    can lead to confusion because the display does not show the modified
    VS. Any correction of this behavior would need to be made in the
    core autopilot. When using external controls to modify hold
    altitude this sequence is recommended:

-   \[Confirm ALT mode shown\]

<!-- -->

-   \[Adjust Target Altitude\]

<!-- -->

-   \[Use mapped ALT toggle to leave ALT mode\]

<!-- -->

-   \[Use mapped VS INC/DEC control or key to set appropriate value
    either up or down towards the selected target altitude\]

**INTENTIONAL DIFFERENCES**

1.  For the real KAP140 in ALT hold mode, the up and down buttons will
    change the held altitude 20 feet. This is not possible in the MSFS
    core autopilot so the buttons will instead display the vertical
    speed being used by the core autopilot. It is not possible to adjust
    VS value in ALT mode using the mouse to select UP or DOWN.

**DEBUG CONSOLE OUTPUT**

The Beta test version outputs status change information to the Coherent
Debug console.

See
<https://docs.flightsimulator.com/html/Additional_Information/Coherent_GT_Debugger.htm>

Console prints will be removed after Beta test phase.

**AIRCRAFT TESTED LIST**

*Cessna 172 Steam
*Justfriends EA-7 Edgley Optica
*Aerosoft DHC-6 Twin Otter
*Asobo Pilatus PC-6
*Milviz Pilatus PC-6

**USING HONEYCOMB BRAVO (Standard Control Layout)**

The default profile works correctly for KAP140 control except:

1. The default mapping of the Bravo ALT button is not exactly equivalent
function to the on-screen ALT clickable. Pressing Bravo ALT button will
enter ALT but not exit ALT mode. To exit altitude hold it is required to
press Bravo VS button. This can be corrected by using script-based
utility like Lorby AAO (below).

2. The default control mapping of the Bravo HDG button will result in
heading bug being reset to current heading when HDG button is used. This
can be avoided using script-based utility like Lorby AAO to substitute
for default control assignment.

3. Some models of the Pilatus PC-6 plane use a combination of Garmin 1000
plus KAP140. The AP function normally found in G1000 is removed in these
planes. The mouse can be used to modify target altitude using the
on-screen rotary knob. But the default mapping for Bravo knob
normally used to adjust target altitude selection does not change the
value on PC-6. Most likely this control event is blocked by the Working
Title NXi. The keyboard equivalents are also not able to change the
value. 

**AAO Scripts**

```
(A:AUTOPILOT·MASTER,·Bool)·1·==·if{·(A:AUTOPILOT·ALTITUDE·LOCK,·Bool)·1·==·if{·1·(&gt;K:AP\_PANEL\_VS\_ON)·}·els{·1·(&gt;K:AP\_ALT\_HOLD\_ON)·}·}

(A:AUTOPILOT·MASTER,·Bool)·1·==·if{·(A:AUTOPILOT·HEADING·LOCK,·Bool)·0·==·if{·1·(>K:AP_HDG_HOLD_ON)·}·els{·1·(>K:AP_HDG_HOLD_OFF)·}·}
```

**KEYBOARD EQUIVALENTS (With Custom Layout)**

Starting with the default layout add the suggested assignments below
(after removing any existing assignments)

|Function|Keyboard|Added Mappings|
|--------|--------|--------|
|AP|Z||
|HDG|ctrl-h|map to TOGGLE AUTOPILOT HEADING HOLD|
|NAV|ctrl-n||
|APR|ctrl-a|map to TOGGLE AUTOPILOT APPROACH HOLD|
|REV|ctrl-b|map to AUTOPILOT BACK COURSE HOLD ON|
|ALT (on)|ctrl-q|map to TOGGLE AUTOPILOT ALTITUDE HOLD|
|ALT (off)|ctrl-v|map to TOGGLE AUTOPILOT VS HOLD|
|UP (+VS)|ctrl-home||
|DN (-VS)|ctrl-end||
|ROTARY+|ctrl-page up||
|ROTARY-|ctrl-page dn||
