# Usage

Provide `routerLinkActiveMatch` directive, routeNode should be substring which potentially matches all possible routes.

menu.component.ts

```ts
  <a
    [routerLink]="item.param ? [item.routerLink, item.param] : [item.routerLink]"
    routerLinkActive="active"
    [routerLinkActiveMatch]="item.routeNode"
  >
```
