# LegalDash redesign — integration guide

Redesign of the **Off-Limits & Non-Solicit Register** plus a new **LegalDash landing page**,
built against your existing design system (Angular 15, Bootstrap 5, ng-zorro `nz-table`,
Bootstrap Icons, Poppins, primary `#0B5ED7`, card shadow `0 5px 10px rgba(11,94,215,.19)`,
radius `2px`). No new dependencies — every module used is already imported in `pages.module.ts`.

## What's in here

```
preview.html                         Standalone visual preview (real tokens) — open in a browser
angular/
  off-limits-register/               Redesigned register (drop-in component)
    off-limits-register.component.html|ts|scss
  legaldash-landing/                 New landing page with navigation tiles
    legaldash-landing.component.html|ts|scss
INTEGRATION.md                       This file
```

`preview.html` is a faithful, clickable mock in the LegalDash style for sign-off. The Angular
components are the real deliverable.

## 1. Copy the components

Place both folders under `src/app/pages/`:

```
src/app/pages/off-limits-register/…
src/app/pages/legaldash-landing/…
```

## 2. Declare them (`src/app/pages/pages.module.ts`)

```ts
import { OffLimitsRegisterComponent } from './off-limits-register/off-limits-register.component';
import { LegaldashLandingComponent } from './legaldash-landing/legaldash-landing.component';

@NgModule({
  declarations: [
    // …existing…
    OffLimitsRegisterComponent,
    LegaldashLandingComponent,
  ],
  // imports already present: FormsModule, BsDropdownModule.forRoot(),
  // NzTableModule, NzTagModule, NzSelectModule, NzToolTipModule
})
```

## 3. Add routes (`src/app/pages/pages-routing.module.ts`)

```ts
{ path: 'legaldash',  component: LegaldashLandingComponent },
{ path: 'off-limits', component: OffLimitsRegisterComponent },
```

The landing tiles route to your existing paths (`contract-register`, `consultant-submission`,
`change-request`, `trustedUser`, `agreement-template`) plus the new `off-limits`. Point the
**"LegalDash" entry from the SH Hub at `/pages/legaldash`** so users land on the tiles instead
of dropping straight into a register.

## 4. Show these pages without the left sidebar

The brief removes the sidebar from the register; navigation now lives on the landing page.
Your `full-layout` is already a bare `<router-outlet>` (no sidebar), and `vertical` is the
topbar + sidebar layout.

Recommended: give `full-layout` a topbar and route the two new pages through it.

```html
<!-- src/app/layouts/full-layout/full-layout/full-layout.component.html -->
<app-topbar></app-topbar>
<div class="ld-shell"><router-outlet></router-outlet></div>
```

```scss
.ld-shell { max-width: 1320px; margin: 0 auto; padding: 22px; }
```

Then nest `legaldash` and `off-limits` under the `full-layout` route (keep every other page on
the `vertical` layout untouched). If you'd rather not touch layouts, you can instead keep them on
`vertical` and hide the sidebar for just these routes with a body/route class — but the
full-layout route is cleaner.

## 5. Wire real data

In `off-limits-register.component.ts`, replace `allData` with the register feed (e.g. via your
`AssignmentService`). Keep dates formatted `YYYY-MM-DD`:

```ts
import * as moment from 'moment';
startDate: moment(api.startDate).format('YYYY-MM-DD'),
lastUpdated: moment(api.lastUpdated).format('YYYY-MM-DD'),
```

`teamOptions` is derived from the data at runtime; if a canonical Team list exists elsewhere,
feed it in instead.

## Spec → implementation map

| Requirement | Where |
|---|---|
| LegalDash landing with tiles | `legaldash-landing` component |
| Sidebar removed; nav via landing | route under `full-layout` (step 4) |
| Title + guidance statement | `.lg-title-header-legal` + `.ol-guidance` |
| Summary stat cards (4) | `stats` array + `.ol-stat` cards |
| Wide, prominent search | `.ol-search` (flex-1) above the table |
| Region **tabs**; Team **dropdown** | `.ol-tabs` + `nz-select` |
| Column order Client→Assignment→Team→Region→Scope→Start→Last Updated | `nz-table` `<thead>` |
| Overview & End Date hidden by default, behind eye control | `showOverview` / `showEndDate` + Columns dropdown |
| Industry → **Team** as colour-coded tags | `.ol-tag-team-*` |
| Region as colour-coded tags (categories only) | `.ol-tag-region-*` |
| Scope column w/ truncation + tooltip/expand | `.ol-scope` + `nz-tooltip` + toggle |
| Last Updated, all dates `YYYY-MM-DD` | data + `.ol-date` |

## Notes

- Team/Region tag colours are drawn from your theme palette (`_variables.scss`: indigo `#405189`,
  teal `#4ab0c1`, green `#2dcb73`, yellow `#f6b749`, purple `#8561f9`, cyan `#0B5ED7`). Add a
  `.ol-tag-team-…` / `.ol-tag-region-…` rule for any new value; unmapped values fall back to grey.
- The **stat numbers and the 7 extra rows are placeholder data** (the screenshots only had two
  rows). Swap in real figures/records.
- Column visibility uses the ngx-bootstrap `dropdown` directive already used in your topbar, and
  the Team filter uses `nz-select` as elsewhere in the app — no new modules.
