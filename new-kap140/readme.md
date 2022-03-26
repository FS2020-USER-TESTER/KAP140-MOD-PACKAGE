Documentation for the March 2022 Update KAP140 MOD Package
==========================================================

\*BETA RELEASE 0.100\*
======================

This package corrects some issues with the built-in KAP140 autopilot in
<span class="underline">Microsoft Flight Simulator 2020</span>. This
March 2022 Update has many changes and should be considered a rewrite

Based on concepts in:
<https://github.com/m-chomiczewski/MC_KAP140_MOD/tree/main/mc-kap140>

**INSTALLATION**

Unzip the downloaded release file and copy the resulting directory to
your Community folder.

You may report issues in the github issue list.

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

-   Able to be controlled with Mouse, keyboard, or external devices like
    Honeycomb Bravo. Achieving this goal required rewrite of the HTML
    button press handler.

-   On AP turn-on, the actual KAP140 AP will enter ‘Wing Leveler’ and
    capture the current vertical speed. This behavior can be selected in
    airplanes system.cfg but in case other defaults are present in that
    file, the MOD will force this behavior.

**VERSION DISPLAY**

**The MOD output its version (currently v0.100) in the last page of the
power-on test.**

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
    momentarily equals the current aircraft altitude. To avoid this, use
    knob to adjust to a new altitude target while in ALT mode then
    change mode from ALT to VS and select a vertical speed in the
    desired direction. Target altitude may also be set with AP off.

4.  When selecting altitude hold mode, the MSFS core autopilot will
    round the held altitude to the nearest 100 feet.

5.  When using rotary knobs to choose a new target altitude in ALT mode,
    the ALT Arm display value will correctly illuminate. However, when
    then using ALT button to leave altitude hold in order to select a
    vertical speed toward the new altitude the ALT Arm display will
    disappear. This is due to incorrect 0 value for sim variable
    “AUTOPILOT ALTITUDE ARM”. The autopilot is correctly armed and will
    capture the set target and enter ALT mode if VS is used to command a
    change in altitude in the correct direction.

**DEBUG CONSOLE OUTPUT**

The Beta test version outputs status change information to the Coherent
Debug console.

See
<https://docs.flightsimulator.com/html/Additional_Information/Coherent_GT_Debugger.htm?rhhlterm=debugger&rhsearch=debugger>

This will be removed after Beta test.

**AIRCRAFT TESTED LIST**

Cessna 172 Steam

Justfriends EA-7 Edgley Optica

**PLANNED FOR TEST IN FUTURE**

Pilatus PC6

Aerosoft DHC-6 Twin Otter

**KEYBOARD EQUIVALENTS (Custom LAYOUT)**

Starting with the default layout add the suggested assignments below

Button Keyboard

AP z

HDG ctrl-h suggested TOGGLE AUTOPILOT HEADING HOLD

NAV ctrl-n

APR ctrl-a suggested TOGGLE AUTOPILOT APPROACH HOLD

REV ctrl-b suggested AUTOPILOT BACK COURSE HOLD ON

ALT ctrl-q suggested TOGGLE AUTOPILOT ALTITUDE HOLD

UP (+VS) ctrl-home

DN (-VS) ctrl-end

ROTARY+ ctrl-page up

ROTARY - ctrl-page dn

**HONEYCOMB BRAVO**

Tested default profile. No recommended changes at this time.
