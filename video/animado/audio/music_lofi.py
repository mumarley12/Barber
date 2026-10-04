"""Trilha lo-fi para o vídeo de 60s: piano elétrico, batida com swing, aro de caixa, chocalho e chiado de vinil.

Volume final bem baixo (-32 LUFS).
"""
import os
import subprocess

import numpy as np
from scipy.signal import butter, lfilter

from build_audio import OUT, SR, hz, write_wav

DUR = 60.2
BPM = 78
BEAT = 60 / BPM
SWING = 0.16  # atraso das colcheias "de trás" (fração do tempo)
rng = np.random.default_rng(78)
n = int(DUR * SR)
t_all = np.arange(n) / SR


def lp(x, f):
    b, a = butter(2, f / (SR / 2), 'low')
    return lfilter(b, a, x)


def hp(x, f):
    b, a = butter(2, f / (SR / 2), 'high')
    return lfilter(b, a, x)


def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band')
    return lfilter(b, a, x)


def rhodes(f, length, vel=1.0):
    """Piano elétrico por FM simples (timbre de sino macio)."""
    ln = int(length * SR)
    t = np.arange(ln) / SR
    mod = np.sin(2 * np.pi * f * 1.0 * t) * 1.4 * np.exp(-t * 3)
    tone = np.sin(2 * np.pi * f * t + mod) * np.exp(-t * 1.1)
    trem = 1 + 0.12 * np.sin(2 * np.pi * 4.5 * t)
    return tone * trem * np.minimum(1, t / 0.01) * vel


def place(track, start_s, sig):
    s = int(start_s * SR)
    if s >= len(track):
        return
    track[s:s + len(sig)] += sig[: len(track) - s]


# progressão em Eb: Ebmaj9 - Cm9 - Abmaj9 - Bb6 (1 compasso cada)
prog = [
    ('D#', [('D#', 3), ('A#', 3), ('D', 4), ('G', 4), ('F', 4)]),
    ('C', [('C', 3), ('G', 3), ('A#', 3), ('D#', 4), ('D', 4)]),
    ('G#', [('G#', 2), ('D#', 3), ('G', 3), ('C', 4), ('A#', 3)]),
    ('A#', [('A#', 2), ('F', 3), ('D', 4), ('G', 4), ('C', 4)]),
]
bar = BEAT * 4

keys = np.zeros(n)
bass = np.zeros(n)
drums = np.zeros(n)
bars = int(DUR / bar) + 1
for bi in range(bars):
    start = bi * bar
    root, notes = prog[bi % len(prog)]
    # acorde no 1 e reforço "atrasado" no 2-e (swing)
    for j, (name, octv) in enumerate(notes):
        place(keys, start + j * 0.012, rhodes(hz(name, octv), bar * 0.95, 0.11))
    for name, octv in notes[2:4]:
        place(keys, start + BEAT * (1.5 + SWING), rhodes(hz(name, octv), BEAT * 1.4, 0.06))
    # baixo: tônica no 1 e quinta no 3
    for beat_pos, nm in ((0, root), (2.5 + SWING, root), (3, root)):
        f = hz(nm, 1 if nm in ('G#', 'A#') else 2)
        ln = int(BEAT * 0.9 * SR)
        tt = np.arange(ln) / SR
        place(bass, start + beat_pos * BEAT, np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.5) * 0.4)
    if start < 6:
        continue  # gancho só com os acordes
    # bumbo: 1 e "2-e" (padrão boom-bap)
    for kp in (0, 1.5 + SWING, 2.75):
        ln = int(0.4 * SR)
        tt = np.arange(ln) / SR
        f = 40 + 55 * np.exp(-tt * 25)
        place(drums, start + kp * BEAT, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 7) * 0.5)
    # aro de caixa no 2 e 4
    for sp in (1, 3):
        ln = int(0.08 * SR)
        tt = np.arange(ln) / SR
        click = bp(rng.standard_normal(ln), 1200, 4000) * np.exp(-tt * 60) * 0.35
        tone = np.sin(2 * np.pi * 1700 * tt) * np.exp(-tt * 80) * 0.15
        place(drums, start + sp * BEAT, click + tone)
    # chocalho em semicolcheias com swing, entra aos 22s
    if start >= 22:
        for s16 in range(16):
            pos = s16 / 4 + (SWING / 2 if s16 % 2 else 0)
            ln = int(0.04 * SR)
            tt = np.arange(ln) / SR
            vel = 0.05 if s16 % 4 == 2 else 0.025
            place(drums, start + pos * BEAT, hp(rng.standard_normal(ln), 6000) * np.exp(-tt * 90) * vel)

keys = lp(keys, 3200)
bass = lp(bass, 180)
drums = lp(drums, 7000)  # som abafado, estilo fita

# chiado de vinil
crackle = np.zeros(n)
pops = rng.random(n) < (6 / SR)
crackle[pops] = rng.standard_normal(pops.sum()) * 0.08
crackle = hp(crackle, 1500) + hp(rng.standard_normal(n), 4000) * 0.0008

grow = 0.85 + 0.2 * (t_all / DUR)
mix = (keys * 1.6 + bass) * grow + drums * grow + crackle
fade = np.clip(t_all / 0.8, 0, 1) * np.clip((DUR - t_all) / 3, 0, 1)
mix *= fade
mix /= np.abs(mix).max()

raw = os.path.join(OUT, 'Lofi.raw.wav')
write_wav(raw, mix * 0.9)
dest = os.path.join(os.path.dirname(OUT), '..', 'public', 'audio', 'Sessenta.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-32:TP=-8:LRA=11', '-ar', str(SR), '-ac', '2', dest], check=True)
print('ok')
