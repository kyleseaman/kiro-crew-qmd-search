"""Every colour pair listed in ui/src/theme.ts CONTRAST_PAIRS meets its WCAG ratio."""

import re
import unittest
from pathlib import Path

THEME = Path(__file__).resolve().parent.parent / "ui" / "src" / "theme.ts"


def _lum(hex_: str) -> float:
    h = hex_.lstrip("#")
    chans = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4 for c in chans]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]


def ratio(a: str, b: str) -> float:
    la, lb = sorted((_lum(a), _lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


class ContrastTests(unittest.TestCase):
    def test_pairs(self):
        src = THEME.read_text(encoding="utf-8")
        block = src.split("CONTRAST_PAIRS", 1)[1].split("]\n", 1)[0]
        pairs = re.findall(r"\['(#[0-9a-f]{6})', '(#[0-9a-f]{6})', ([\d.]+), '([^']+)'\]", block)
        self.assertGreater(len(pairs), 20)
        failures = [f"{label}: {fg} on {bg} = {ratio(fg, bg):.2f} < {need}" for fg, bg, need, label in pairs if ratio(fg, bg) < float(need)]
        self.assertEqual(failures, [])


if __name__ == "__main__":
    unittest.main()
