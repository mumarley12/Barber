"""Trilha do vídeo de 60s, estilo diferente das outras: piano elegante, pad, baixo pulsando e estalos de dedo.

Sem bumbo/chimbal eletrônicos. Volume final bem baixo (-27 LUFS), pra ficar de fundo.
"""
import os
import subprocess

import numpy as np
from scipy.signal import butter, lfilter

from build_audio import OUT, SR, hz, write_wav

DUR = 60.2
BPM = 84
BEAT = 60 / BPM
rng = np.random.default_rng(84)
n = int(DUR * SR)
t_all = np.arange(n) / SR


def lp(x, f):
    b, a = butter(2, f / (SR / 2), 'low')
    return lfilter(b, a, x)


def hp(x, f):
    b, a = butter(2, f / (SR / 2), 'high')
    return lfilter(b, a, x)


def piano(f, length, vel=1.0):
    """Nota de piano simples: harmônicos com decaimento diferente + ataque suave."""
    ln = int(length * SR)
    t = np.arange(ln) / SR
    tone = np.zeros(ln)
    for k, amp in enumerate([1.0, 0.45, 0.22, 0.12, 0.06], start=1):
        tone += amp * np.sin(2 * np.pi * f * k * t * (1 + 0.0004 * k)) * np.exp(-t * (1.6 + k * 0.9))
    att = np.minimum(1, t / 0.006)
    return tone * att * vel


# progressão: Cmaj9 - Am9 - Fmaj9 - G6 (2 compassos cada), voicings abertos
prog = [
    ('C', [('C', 3), ('G', 3), ('E', 4), ('B', 4), ('D', 5)]),
    ('A', [('A', 2), ('E', 3), ('C', 4), ('G', 4), ('B', 4)]),
    ('F', [('F', 2), ('C', 3), ('A', 3), ('E', 4), ('G', 4)]),
    ('G', [('G', 2), ('D', 3), ('B', 3), ('E', 4), ('A', 4)]),
]
bar = BEAT * 4
chord_len = bar * 2

piano_tr = np.zeros(n)
pad_tr = np.zeros(n)
bass_tr = np.zeros(n)
pos, k = 0.0, 0
while pos < DUR:
    root, notes = prog[k % len(prog)]
    a = int(pos * SR)
    b = min(n, int((pos + chord_len) * SR))
    t = t_all[a:b] - pos
    # pad: senoides suaves com vibrato lento
    seg = np.zeros(b - a)
    for name, octv in notes[1:]:
        f = hz(name, octv)
        seg += np.sin(2 * np.pi * f * t + 0.3 * np.sin(2 * np.pi * 0.2 * t)) * 0.035
    fade = np.minimum(1, np.minimum(t / 0.8, (chord_len - t) / 0.8))
    pad_tr[a:b] += seg * np.clip(fade, 0, 1)
    # piano: acorde arpejado no começo de cada compasso + notas soltas
    for barn in range(2):
        start = pos + barn * bar
        for j, (name, octv) in enumerate(notes[1:] if barn == 0 else notes[2:]):
            s = int((start + j * 0.06) * SR)
            if s >= n:
                continue
            note = piano(hz(name, octv), 3.2, 0.16)
            piano_tr[s:s + len(note)] += note[: n - s]
        # melodia leve no 3º tempo
        mel = notes[-1] if barn == 0 else notes[-2]
        s = int((start + BEAT * 2.5) * SR)
        if s < n:
            note = piano(hz(mel[0], mel[1] + 1), 2.0, 0.09)
            piano_tr[s:s + len(note)] += note[: n - s]
    # baixo pulsando em colcheias, bem macio
    f = hz(root, 1)
    p = pos
    while p < min(DUR, pos + chord_len) - 0.01:
        s = int(p * SR)
        ln = min(n - s, int(BEAT * 0.45 * SR))
        tt = np.arange(ln) / SR
        bass_tr[s:s + ln] += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 5) * 0.28
        p += BEAT / 2
    pos += chord_len
    k += 1
bass_tr = lp(bass_tr, 220)

# estalos de dedo nos tempos 2 e 4, entram depois do gancho (6s)
snap_tr = np.zeros(n)
for i in range(int(DUR / BEAT)):
    if i % 4 in (1, 3) and i * BEAT >= 6:
        s = int(i * BEAT * SR)
        ln = min(n - s, int(0.12 * SR))
        tt = np.arange(ln) / SR
        snap_tr[s:s + ln] += hp(rng.standard_normal(ln), 2500) * np.exp(-tt * 45) * 0.12
    # "tic" suave nas colcheias, bem baixinho, a partir de 22s (ritmo crescente)
    if i * BEAT >= 22:
        for h in (0, 0.5):
            s = int((i + h) * BEAT * SR)
            ln = min(n - s, int(0.03 * SR))
            if ln > 0:
                tt = np.arange(ln) / SR
                snap_tr[s:s + ln] += hp(rng.standard_normal(ln), 8000) * np.exp(-tt * 120) * 0.025

# intensidade: baixo entra aos 6s, tudo cresce de leve até o fim
bass_tr *= np.clip((t_all - 6) / 1.5, 0, 1)
grow = 0.8 + 0.25 * (t_all / DUR)
mix = (piano_tr + pad_tr) * grow + bass_tr * grow + snap_tr
mix = lp(mix, 6500)
fade_out = np.clip((DUR - t_all) / 2.5, 0, 1)
fade_in = np.clip(t_all / 0.8, 0, 1)
mix *= fade_in * fade_out
mix /= np.abs(mix).max()

raw = os.path.join(OUT, 'Piano.raw.wav')
write_wav(raw, mix * 0.9)
dest = os.path.join(os.path.dirname(OUT), '..', 'public', 'audio', 'Sessenta.wav')
# reverb leve + volume baixo (-27 LUFS)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'aecho=0.8:0.5:60|120:0.25|0.15,loudnorm=I=-27:TP=-6:LRA=11',
                '-ar', str(SR), '-ac', '2', dest], check=True)
print('ok')
