**CHANGE LIST – KAP140 MOD **

In original code, variables to control the right-side display were
modified inside the input event handler that processed AP and ALT
on-screen button. This code was not executed when external controls were
used in place of mouse and therefore the display did not track the event
correctly. These display control changes were moved to new logic inside
the display Update routine which is called periodically by the gauge
logic.

Class state variable were established to allow the Update routine to
determine if autopilot state was changed since the last call. When state
changes were noted from any control source, the display would be updated
correctly and if VS value is modified, the display will show the new
value.

In the event that AP was just turned on, a routine was added to validate
the state and force the autopilot into VS mode if needed. Automatic VS
mode entry can be configured in the airplanes cfg file however not all
plane designers used values consistent with real-world KAP140.
Therefore, if needed, vertical speed mode is forced upon AP being turned
on. The value of vertical speed was captured from current operation
however when forced, the value used is adjusted to be between minus 1500
and 700 which seemed realistic compromise for small aircraft.

Similarily in real life the KAP140 will enter wing-leveler mode when
turned on and if this was found to be mis-configured by aircraft
designer, this mode is forced.

In the processing of AP on event, the airspeed was checked and if lower
than 10.0, AP was forced off. This is not realistic but protects the
user from mis-set trim due to a core bug when autopilot is tested on the
ground.

When the AP is turned off, the internal simulator variables are cleared
to default values which avoids some mis-display of state when AP is off.

In the case of ALT mode entry, the altitude target variable and display
were updated to match the current altitude.

The Baro display value (InHg) was rounded to match standard usage.
