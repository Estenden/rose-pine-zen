# Rosé Pine for Zen Browser

A Rosé Pine theme for [Zen Browser](https://zen-browser.app), built on
[`rose-pine/zen-browser`](https://github.com/rose-pine/zen-browser) and extended
to fix values that ship as hardcoded literals or system colors — things a palette
cannot reach by overriding a custom property.

Verified against **Zen Browser 1.23b** (build 20261002114451) on Linux/Wayland.

## Contents

```
dist/
  userChrome.css        the theme
  rose-pine-main.css    palette, dark        (default)
  rose-pine-moon.css    palette, dark, muted
  rose-pine-dawn.css    palette, light
  user.js               prefs that must be set before chrome CSS loads
```

## Install

Zen reads `chrome/userChrome.css` from the profile directory.

**1. Find the profile folder.** Open Zen, go to `about:support`, and click
**Open Profile Folder** on the *Profile Folder* row.

On a typical Linux install this is `~/.config/zen/<profile-name>/`. On Flatpak it
is `~/.var/app/app.zen_browser.zen/.zen/`.

**2. Copy the theme in.**

```sh
# adjust the profile path if yours differs
PROFILE="$HOME/.config/zen/dlotsfvr.Default (release)"
mkdir -p "$PROFILE/chrome"
cp dist/userChrome.css dist/rose-pine-*.css "$PROFILE/chrome/"
cp dist/user.js "$PROFILE/"
```

**3. Restart Zen.**

The pref in `user.js` must be set before `userChrome.css` is parsed, which is why
it lives there rather than in `about:config`. Zen also sets this pref
automatically if it detects an existing `userChrome.css`
(`ZenUIManager._migrateV1`), so if your install predates this theme the theme may
already work without the file — but `user.js` is what makes it reliable.

Alternatively, skip `user.js` and set the pref by hand:

- `toolkit.legacyUserProfileCustomizations.stylesheets` → `true`
- `zen.view.window.scheme` → `0` for a dark palette, `1` for light

## Switching variant

Change the `@import` at the top of `userChrome.css`:

```css
@import "rose-pine-main.css";   /* dark          */
@import "rose-pine-moon.css";   /* dark, muted   */
@import "rose-pine-dawn.css";   /* light         */
```

Then also set `zen.view.window.scheme` to `1` in `user.js` for Dawn, or `0` for
Main and Moon.

## Tuning

These tokens live in the `:root` block and drive everything local:

| Token | Default | Controls |
|---|---|---|
| `--rp-accent` | `#eb6f92` | star icon, accent buttons, base of the border mix |
| `--rp-menu-hover` | `var(--overlay)` | menu and list hover fill |
| `--rp-urlbar-bg` | `var(--surface)` | urlbar field fill |
| `--rp-border` | accent at 40% | urlbar edge and every popup outline |
| `--rp-border-width` | `2px` | width of that outline |

`--rp-accent` matches the niri focus-ring `active-color` in
`~/.config/niri/config.kdl`, so the browser chrome and the window ring are the
same color. Change it here and in niri together if you want them to differ.

`--rp-border-width` applies to both popups and the urlbar. Popups draw it as a
`border` and the urlbar as an `outline`, so a single token keeps them equal.
If 2px reads too heavy, 1.5px is a reasonable middle; note the popups default
to 1px in Firefox and the urlbar to 0.5px, so anything above those is an
increase over stock.

Separators are removed entirely. To keep the divider but recolor it, change:

```css
menupopup { --panel-separator-color: var(--rp-overlay) !important; }
panel > toolbarseparator { color: var(--rp-overlay) !important; }
```

## What this fixes beyond the upstream theme

Upstream maps the palette onto Zen's `--zen-*` variables. Several colors Zen uses
are literals or system colors, which no palette reaches by overriding a variable.
Each fix below is commented in `userChrome.css` with the source reference.

| Symptom | Cause | Fix |
|---|---|---|
| Context menu separators stay visible | `menu.css:154` draws them from `--panel-separator-color`, which Zen sets to a `currentColor` mix | set that variable to `transparent` |
| Menu and list hover is blue | `menu.css:280` uses the system color `-moz-menuhover`, which resolves to the GTK accent | set `-moz-menuhover` |
| "..." menu highlight differs from context menus | that menu is a `panel`, not a `menupopup`, and reads `--button-background-color-hover`; Firefox resolves it to a violet mix | override the `-ghost-` pair as well |
| Bookmark star is blue | `--toolbarbutton-icon-fill-attention` ships as `light-dark(--color-blue-60, --color-cyan-30)`, and Zen pins it at `:root !important` | replace it at `:root` |
| Urlbar and its results list are neutral grey | `zen-omnibox.css:278` hardcodes `rgb(24,24,24)`; line 291 hardcodes a `rgb(75,75,75)` outline | set the properties directly |
| Popup border appears offset, with a dark band outside | `border` set on the host element fights the one `popup.css:76` already draws on `::part(content)`; the band is `--panel-box-shadow` plus its margin | set the variable, and zero the shadow pair |
| Some accent buttons read grey | `zen-buttons.css:87` derives them from `--zen-primary-color` via `oklch()`, which keeps the input's hue — a near-black primary yields near-grey | override the derived value |

## Known limitations

- The "Sign in to sync" banner in the app menu renders as a saturated purple
  (`rgb(59,34,121)`) that is not part of the palette. It is set from a hardcoded
  value in the sync promotion markup and was left alone.
- Page content is deliberately unthemed; only browser chrome is affected.
- Line references are to Zen Browser 1.23b. A Zen update may shift them. If
  something regresses, check whether the cited file and line still match before
  changing the theme.

## Credits

- [rose-pine/zen-browser](https://github.com/rose-pine/zen-browser) — MIT,
  GoulvenV and Wiktor Zykubek. Palette files and the base variable mapping come
  from there. Upstream ships a Catppuccin blue (`#89b4fa`) in `.content-shortcuts`;
  that one value is recolored to iris here.
- [rose-pine](https://github.com/rose-pine/rose-pine-theme) — the palette itself.

## License

MIT. See [LICENSE](LICENSE). The palette files and the upstream-derived block in
`userChrome.css` remain under the original project's MIT license.
