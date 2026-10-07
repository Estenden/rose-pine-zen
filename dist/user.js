// Rosé Pine prefs for Zen Browser.
//
// user.js is read on every startup and takes precedence over prefs.js and the
// shipped defaults, so these survive a browser shutdown. prefs.js is rewritten
// by the browser on exit, so editing it is not durable.
//
// Install by copying this file into the profile root (see README).

// Required for chrome/userChrome.css to be loaded at all.
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);

// 0 = dark, 1 = light, 2 = follow system.
// Rosé Pine Main and Moon are dark palettes, so force dark chrome.
// Set this to 1 when switching to rose-pine-dawn.css.
user_pref("zen.view.window.scheme", 0);

// Accent color read by zenThemeModifier.js for --zen-primary-color.
// Kept as --base to match the value userChrome.css assigns. Note that Zen
// derives accent-button backgrounds from this through oklch(), so a near-black
// value yields near-grey accents — userChrome.css overrides those separately.
user_pref("zen.theme.accent-color", "#191724");
