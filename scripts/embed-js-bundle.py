#!/usr/bin/env python3
"""Embed the JS bundle in the Android debug APK.

Why this exists
---------------
The android/app/build.gradle that `expo prebuild` generates does NOT set
`debuggableVariants`. That string only appears inside a comment:

    /* Variants */
    //   If you add flavors like lite, prod, etc. you'll have to list your debuggableVariants.
    // debggableVariants = ["liteDebug", "prodDebug"]

So the react-native gradle plugin default applies. In react-native 0.86
(ReactExtension.kt) that default is:

    debuggableVariants = ["debug", "debugOptimized"]

Variants listed there are built WITHOUT a JS bundle, because Gradle assumes
Metro will serve the JS at runtime. A debug APK built that way therefore
starts on a phone, finds no index.android.bundle, and shows:

    Unable to load script.
    Make sure you're running Metro or that your bundle
    'index.android.bundle' is packaged correctly for release.

What this script does
---------------------
It writes a real, uncommented `debuggableVariants = []` inside the react { }
block. That overrides the plugin default and makes `assembleDebug` embed
index.android.bundle, so the APK runs standalone.

Important: merely rewriting the commented-out example changes nothing, because
comments are not settings. The line must be added as real Groovy code.

Usage: python3 scripts/embed-js-bundle.py <path-to-android-dir>
"""
import re
import sys
from pathlib import Path

VARIANT_KEY = "deb" + "uggableVariants"
SETTING = "{} = []".format(VARIANT_KEY)
ANCHOR = 'bundleCommand = "export:embed"'


def is_comment(line):
    stripped = line.strip()
    return stripped.startswith("//") or stripped.startswith("/*") or stripped.startswith("*")


def starts_setting(line):
    return re.match(r"^{}\s*=".format(re.escape(VARIANT_KEY)), line.strip()) is not None


def find_setting(lines):
    """Index of a real (non-comment) debuggableVariants line, or None."""
    for i, line in enumerate(lines):
        if is_comment(line):
            continue
        if starts_setting(line):
            return i
    return None


def react_block_bounds(lines):
    """(start, end) indices of the react { ... } block, or None."""
    start = None
    for i, line in enumerate(lines):
        if re.match(r"^\s*react\s*\{\s*$", line):
            start = i
            break
    if start is None:
        return None
    depth = 0
    for j in range(start, len(lines)):
        depth += lines[j].count("{") - lines[j].count("}")
        if depth <= 0:
            return start, j
    return None


def indentation(line):
    m = re.match(r"^(\s*)", line)
    return m.group(1) or "    "


def patch(build_gradle):
    lines = build_gradle.read_text().splitlines()

    print("--- matching lines before ---")
    for i, line in enumerate(lines):
        if "bundleCommand" in line or VARIANT_KEY in line:
            print("{}: {}".format(i + 1, repr(line)))

    idx = find_setting(lines)
    if idx is not None:
        # Normalise the existing real setting to an empty list.
        lines[idx] = re.sub(
            r"^(\s*" + re.escape(VARIANT_KEY) + r"\s*=\s*).*$",
            r"\1[]",
            lines[idx],
        )
        how = "rewrote existing line {}".format(idx + 1)
    else:
        bounds = react_block_bounds(lines)
        if bounds is None:
            print("ERROR: could not find the react { } block", file=sys.stderr)
            print("\n".join(lines))
            return False
        start, end = bounds

        insert_at = None
        for j in range(start, end + 1):
            if ANCHOR in lines[j]:
                insert_at = j + 1
                break
        if insert_at is None:
            insert_at = start + 1

        indent = indentation(lines[insert_at - 1])
        lines.insert(insert_at, indent + SETTING)
        how = "inserted at line {}".format(insert_at + 1)

    build_gradle.write_text("\n".join(lines) + "\n")

    print("--- matching lines after ({}) ---".format(how))
    for i, line in enumerate(lines):
        if "bundleCommand" in line or VARIANT_KEY in line:
            print("{}: {}".format(i + 1, repr(line)))
    return True


def main():
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
    print("patched: {}".format(SETTING))
    return 0


if __name__ == "__main__":
    sys.exit(main())
