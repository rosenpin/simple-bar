export const timeStyles = /* css */ `
.time {
  position: relative;
  background-color: var(--minor);
  overflow: hidden;
  color: white;
  z-index: 0;
}
.time__filler {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scaleX(0);
  background-color: rgba(0, 0, 0, 0.15);
  transform-origin: left;
  pointer-events: none;
  touch-action: none;
  z-index: -1;
}
`
