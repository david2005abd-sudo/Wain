#!/usr/bin/env python3
"""Embed the JS bundle in the Android debug APK.

`expo prebuild` generates android/app/build.gradle with the react-native
default:

    debuggableVariants = ["debug", "debugOptimized"]

Variants listed there are built WITHOUT a JS bundle (Gradle assumes Metro
will serve the JS at runtime). A debug APK built that way therefore starts
on a phone, finds no index.android.bundle, and shows:

    Unable to load script.
    Make sure you're running Metro or that your bundle
    'index.android.bundle' is packaged correctly for release.

This script rewrites that list to [] so assembleDebug really embeds the
bundle and the APK works standalone.

Usage: python3 scripts/embed-js-bundle.py <path-to-android-dir>
"""
import re
import sys
from pathlib import Path

MARKER = "bundleCommand"
VARIANT_KEY = "debuggableVariants"


def patch(build_gradle: Path) -> bool:
    src = build_gradle.read_text()

    print("--- before ---")
    for line in src.splitlines():
        if MARKER in line or VARIANT_KEY in line:
            print(repr(line))

    # Case 1: "debuggableVariants = [ ... ]" is already there -> empty it.
    patched, n = re.subn(
        r"(debuggableVariants\s*=\s*)\[[^\]]*\]", r"\1[]", src
    )

    if n == 0:
        # Case 2: not present at all -> inject it right after bundleCommand.
        inject = '{} = []'.format(VARIANT_KEY)
        if "{} = \"export:embed\"".format(MARKER) not in src:
            print(
                "ERROR: neither {} nor {} found in {}".format(
                    VARIANT_KEY, MARKER, build_gradle
                ),
                file=sys.stderr,
            )
            print(src)
            return False
        patched = src.replace(
            '{} = "export:embed"'.format(MARKER),
            '{} = "export:embed"\n    {}'.format(MARKER, inject),
        )

    build_gradle.write_text(patched)

    print("--- after ---")
    for line in patched.splitlines():
        if MARKER in line or VARIANT_KEY in line:
            print(repr(line))
    return True


def main() -> int:
    if len(sys.argv) != 2:
        print(__doc__)
        return 2
    android_dir = Path(sys.argv[1])
    build_gradle = android_dir / "app" / "build.gradle"
    if not build_gradle.is_file():
        print("ERROR: not found: {}".format(build_gradle), file=sys.stderr)
        return 1
    if not patch(build_gradle):
        return 1
    print("patched: {} = []".format(VARIANT_KEY))
    return 0


if __name__ == "__main__":
    sys.exit(main())
