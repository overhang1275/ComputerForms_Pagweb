# React Bits

Drop copied React Bits components here, then import them from Astro with a client directive:

```astro
---
import MyReactBitsComponent from "./reactbits/MyReactBitsComponent.jsx";
---

<MyReactBitsComponent client:visible />
```

Keep each effect lazy with `client:visible` unless it must run immediately.
