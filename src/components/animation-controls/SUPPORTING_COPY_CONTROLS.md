# Supporting copy animation controls

The supporting copy currently uses a pure render-time `motion.div` in
`src/App.tsx`. `TransformControlled` was disconnected so this small animation can
ship without the tuning panel/runtime playback controls.

## Locked source of truth

The active sequence uses `useAnimate` in `src/App.tsx`:

- start timing: scheduled with Motion's `delay` option at `headlineControls.duration * 0.5`
- y: starts at `-3px`, animates to `0px`
- y duration: `1s`
- y easing: Motion `easeInOut`
- opacity: starts at `0`, animates to `1`
- opacity duration: `1.15s`
- opacity delay: `100ms` inside the supporting-copy segment
- opacity easing: Motion `easeIn`

## Reconnect checklist

1. Import `TransformControlled` and `TransformConfig` in `src/App.tsx`.
2. Replace the `motion.div` wrapper in `SupportingCopyMotion` with
   `TransformControlled`.
3. Seed `initialConfig` with the values you want to tune.
4. Use the controls panel to tune the animation.
5. Copy the final y/opacity values back into `SUPPORTING_COPY_ANIMATION`.
6. Disconnect `TransformControlled` again if the supporting copy should remain a
   pure render Motion animation.
