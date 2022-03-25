Documentation for the March 2022 Update KAP140 MOD Package
==========================================================

\*BETA RELEASE 0.100\*
======================

This package corrects some issues with the built-in KAP140 autopilot in
<span class="underline">Microsoft Flight Simulator 2020</span>. This
March 2022 Update has many changes and should be considered a rewrite

Based on:

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

**KNOWN ISSUES – TO BE FIXED**

1.  When Altitude hold mode is entered by button press, the display
    should be updated to the selected altitude. Currently the display is
    0 in this case which is incorrect.

2.  The real KAP140 also includes an Altitude alerting display when AP
    is off. Thus uses the ARM button. This feature is not currently
    modeled. However, when AP is on, the unit will automatically enter
    altitude arm mode when the target altitude is adjusted with rotary
    knobs.

3.  The real KAP140 shows blinking ‘AP’ display for several seconds when
    autopilot is turned off. This is not yet modeled.

**TESTED LIST**

Cessna 172 Steam

Justfriends EA-7 Edgley Optica

**PLANNED FOR TEST IN FUTURE**

Pilatus PC6

Aerosoft DHC-6 Twin Otter
