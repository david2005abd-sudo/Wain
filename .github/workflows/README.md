# android-build

Triggers on push to main/master. Installs JDK 17, runs `npm ci`, type checks,
regenerates native code with `expo prebuild`, makes `gradlew` executable, runs
`./gradlew assembleDebug`, and uploads the APK as a GitHub artifact.
