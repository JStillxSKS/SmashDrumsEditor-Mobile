# Smash Drums Editor — Android APK

For people **without a PC**: install the **`.apk` only**. One file, tap to install.

## What to give users

| File | Who | What |
|------|-----|------|
| **`Smash-Drums-Editor-*.apk`** | Everyone (phones / tablets) | **Only file they need** — install and open the app |
| **`SmashDrumsEditor-full-v*.zip`** | Devs / advanced | Whole project folder in one zip (source + Android project) |

Do **not** send the full zip to non-tech players — send **only the APK**.

## Install (phone / tablet) — simple

1. Download **`Smash-Drums-Editor-x.x.x.apk`** (e.g. from Discord, Drive, or GitHub Releases).
2. Open the file on the phone.
3. If Android asks: allow **Install unknown apps** for Chrome / Files / Discord.
4. Tap **Install** → **Open**.
5. First open: choose Portrait or Landscape when prompted.
6. Tap **Play** once so audio is allowed.

Exported charts (`.indies`) go to the phone’s **Downloads** (or the system download folder).

## Quest / headset

Same APK can be sideloaded with **SideQuest** or `adb install Smash-Drums-Editor-*.apk`.  
UI is built for phone/tablet first; headset works as a large Android screen.

## Build the APK (developers)

**Requirements:** Node.js, JDK **21**, Android SDK (`ANDROID_HOME`).

```bash
cd SmashDrumsEditor
npm install
npm run android:apk
node scripts/copy-android-apk.cjs
```

Outputs:

- `android/app/build/outputs/apk/debug/app-debug.apk` (raw Gradle name)
- `release/apk/Smash-Drums-Editor-<version>.apk` (friendly name after copy script)

Sync only (after web changes):

```bash
npm run android:sync
```

Open Android Studio:

```bash
npm run android:open
```

## Notes

- This is a **debug** APK (easy sideload). Play Store / signed release can come later.
- Desktop Windows portable EXE is unchanged: `npm run desktop:build`.
- App id: `com.smashdrums.editor`
