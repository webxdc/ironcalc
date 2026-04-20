# IronCalc Webxdc
![image](https://github.com/user-attachments/assets/062d2ac0-33b5-46ba-a96c-9698e56ba424)

Bundle the [ironcal](https://github.com/ironcalc/ironcalc) frontend as webxdc application.

## Syncing works, but no Collaboration yet
You can sync your sheets with other group members but you can't work on the same sheet at the same time! Each update from others would remove not persisted changes on your side. see https://docs.ironcalc.com/features/unsupported-features.html#collaboration


## Import & Export
Not yet implemented

## Building
You can build the webxdc with the following commands:

```bash
pnpm install
pnpm build
```

The webxdc will then be in the `dist-xdc` folder.
