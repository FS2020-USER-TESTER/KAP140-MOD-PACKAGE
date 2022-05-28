Documentation for the KAP140 MOD Package
========================================

\*FINAL RELEASE – Software Version 1.00 \*
===========================================

This package corrects some issues with the built-in KAP140 autopilot in
<span class="underline">Microsoft Flight Simulator 2020</span>. 

Based on concepts in:
<https://github.com/m-chomiczewski/MC_KAP140_MOD/tree/main/mc-kap140>

**INSTALLATION**

Releases are here - <https://github.com/FS2020-USER-TESTER/KAP140-MOD-PACKAGE/releases>
Under Assets, download new-kap140_v10*.zip where * is the latest version.
Unzip the downloaded release file and copy the directory new-kap140 to
your Community folder.

**USING PMS50 GTN750-WTT PACKAGE**

On the PMS50.com download site there is available a mod for GTN750 and a second extension package for the WTT version of GTN750 for use in the Milviz C310R. Installing this WTT package from PMS50 blocks loading of this mod and instead loads a KAP140 mod prepared by PMS50.  The standard GTN750 base package does not modify KAP140 or interfere with this mod.

**ISSUES**

You may report issues in the github issue list page.
There is also a discussion thread here
<https://forums.flightsimulator.com/t/new-kap140-autopilot-mod-fixes-problems-when-using-external-controls-or-keyboard/507313/19>

**BACKGROUND**

This MOD is useful for several simulated airplanes using the KAP140
autopilot display. (See tested list below). This KAP140 display is an
HTML/Javascript window to control and monitor the autopilot running in
the simulator core. This MOD provides updated Javascript to correct
operation and adjust display elements to match real-world equipment.

It should be noted that this mod only improves the cockpit display of the
KAP140 panel. The standard Asobo/Microsoft autopilot controlling the plane is not modified.

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

The KAP140 display shows current version (V1.00) in the last page of the power-on
test. Toggle avionics power to see power-on test screen sequence.

**KNOWN ISSUES**

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

5.  If the AP is turned on while plane is on ground as part of
    a test procedure, the trim may run to full nose down or up. If the pilot
    does not recheck trim and correct prior to take-off roll this will
    result in plane being uncontrollable. For this reason, if
    AP engaged with mouse or external control on ground, the MOD will force AP 
    to disengage. This work-arround can be removed when sim is updated to
    remove this behavior. 


**INTENTIONAL DIFFERENCES FROM REAL-LIFE KAP140**

1.  For the real KAP140 in ALT hold mode, the up and down buttons will
    change the held altitude 20 feet. This is not possible in the MSFS
    core autopilot. Therefore, when in ALT mode, the UP and DOWN buttons will modify
    the target altitude by + or - 100 feet.

2.  When using external controls or the GTN750 autopilot page it is possible to place
    the core autopilot into modes not supported by real-life KAP140. To make the situation
    clear to user the following new screen messages have been added:

    GPS - Displayed in NAV mode when navigation source is GPS, otherwise NAV is used.

    PIT - Autopilot is in Pitch Hold mode, and not in either Vertical Speed or Altitude Hold modes

    FLC - Flight Level Change has been selected by external contol. The IAS must be adjusted outside of the KAP140 interface.

3.  The Real-life KAP140 has an ARM button that has been mostly superceeded by the unit being given an auto-arm function. Because the
    core simulator AP logic also implements auto-arm, there is a good match.  If the target altitude is greater than
    100 feet from current, and the aircraft is placed into VS mode with VS up or down in the direction of the 
    target, the unit will auto-arm and capture and hold the target altitude when reached.  Becasue there is no
    command to disable auto-arm in the core AP is is not possible to operate without auto-arm feature. This leaves no needed
    function for the ARM button and it is currently ignored. 


**AIRCRAFT TESTED LIST (Sim Update 9)**

- Cessna 172 Steam
- Justfriends EA-7 Edgley Optica
- Aerosoft DHC-6 Twin Otter
- Asobo Pilatus PC-6
- Milviz Pilatus PC-6
- Milviz Cessna 310R
- Blackbox BN-2B-20
- PMS50 GTN750 Autopilot page

**USING HONEYCOMB BRAVO (Standard Control Layout)**

The default profile loaded by MSFS works correctly for KAP140 control except:

1. The default mapping of the Bravo ALT button is not exactly equivalent
function to the on-screen ALT clickable. Pressing Bravo ALT button will
enter ALT but not exit ALT mode. To exit altitude hold it is required to
press Bravo VS button. If desired, real-life emulation can be generated by 
using script-based utility like Lorby AAO (below).

2. The default control mapping of the Bravo HDG button will result in
heading bug being reset to current heading when HDG button is used. This
can be avoided using script-based utility like Lorby AAO to substitute
for default control assignment.

3. Some models of the Pilatus PC-6 plane use a combination of Garmin 1000
plus KAP140. The AP function normally found in G1000 is removed in these
planes. The mouse can be used to modify target altitude using the
on-screen rotary knob. But the specific default mapping for Bravo knob
normally used to adjust target altitude selection does not change the
value on PC-6. Using external program to connect knob to "AP_ALT_VAR_INC"
and "AP_ALT_VAR_DEC" will enable external control 

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
