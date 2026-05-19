# WordReveal animation controls

`WordReveal` is currently a pure render-time Motion component. The control UI was
disconnected after locking the `natural-5-1` defaults so production rendering stays
simple and declarative.

## Locked source of truth

The active animation values live in `easing.ts`:

- `DEFAULT_WORD_REVEAL_PRESET`
- `DEFAULT_START_DELAY`
- `DEFAULT_STAGGER_DELAY`
- `DEFAULT_BLUR`
- `DEFAULT_OPACITY`
- `DEFAULT_Y`
- `DEFAULT_CONTAINER`

Do not retune values inside `WordReveal.tsx`; update the defaults in `easing.ts`
instead.

## Disconnected tuning pieces

These files were kept so the tuning UI can be restored temporarily:

- `ControlProviders.tsx`
- `TimingSection.tsx`
- `PropertySection.tsx`
- `PresetManager.tsx`
- `presets.ts`
- shared panel/transform controls in `src/components/animation-controls/`

## Reconnect checklist

1. Reintroduce local state in `WordReveal.tsx` for timing, word property config,
   and container config.
2. Re-add the `devControls` prop to `WordRevealProps` if you want the panel to be
   opt-in from call sites.
3. Wrap the rendered output with `AnimationControlProvider` and
   `WordRevealControlProviders`.
4. Re-add control sections for timing, properties, container, and presets.
5. Use the tuning UI to save a preset, then copy the final saved values into
   `DEFAULT_WORD_REVEAL_PRESET` in `easing.ts`.
6. Disconnect the controls again before shipping if the component should remain
   pure render Motion.
