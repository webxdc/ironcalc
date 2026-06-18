# IronCalc Webxdc
![image](https://github.com/user-attachments/assets/062d2ac0-33b5-46ba-a96c-9698e56ba424)

Bundle the [ironcal](https://github.com/ironcalc/ironcalc) frontend as webxdc application.

## Syncing
You can sync your sheets with other group members. 


## Building
You can build the webxdc with the following commands:

```bash
pnpm install
pnpm build
```

The webxdc will then be in the `dist-xdc` folder.

## Developing with webxdc-dev

[webxdc-dev](https://github.com/webxdc/webxdc-dev) simulates multiple peers so you
can test syncing locally. Two workflows are available:

Run against the vite dev server (hot-reload, best for iterating):

```bash
pnpm dev:webxdc
```

Run against the actual built `.xdc` artifact (faithful to what ships):

```bash
pnpm webxdc:xdc
```

Both open the webxdc-dev frontend on `http://localhost:7000`. There is also
`pnpm webxdc:dist`, which runs against the unpacked `dist` directory.
