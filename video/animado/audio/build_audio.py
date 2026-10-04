"""Gera a narração (voz offline Piper), a trilha instrumental e a mixagem de cada vídeo.

Saídas:
  ../src/timings.json      início e fim de cada cena (a cena cresce se a fala for maior)
  out/<Video>.wav          áudio final mixado (voz + música com ducking)
"""
import json
import os
import subprocess

import numpy as np
from scipy.signal import butter, lfilter

HERE = os.path.dirname(os.path.abspath(__file__))
PIPER = os.environ.get('PIPER_BIN', '/tmp/claude-0/-home-user-Barber/6e2908cf-5214-57ae-97f9-8ee2eac492b1/scratchpad/tts/piper/piper')
MODEL = os.environ.get('PIPER_MODEL', '/tmp/claude-0/-home-user-Barber/6e2908cf-5214-57ae-97f9-8ee2eac492b1/scratchpad/tts/pt-br-edresson-low.onnx')
SR = 44100
LEAD = 0.35   # a fala começa um pouco depois do início da cena
TAIL = 0.6    # respiro depois da fala antes de trocar de cena

OUT = os.path.join(HERE, 'out')
os.makedirs(os.path.join(OUT, 'voz'), exist_ok=True)


def read_wav(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()


def write_wav(path, x, channels=1):
    x = np.clip(x, -1, 1).astype(np.float32)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', str(channels), '-ar', str(SR), '-i', '-', path], input=x.tobytes(), check=True)


def voice(text, path):
    raw = path.replace('.wav', '.raw.wav')
    subprocess.run([PIPER, '--model', MODEL, '--length_scale', '0.9', '--sentence_silence', '0.25', '--output_file', raw],
                   input=text.encode(), check=True, capture_output=True)
    # tira graves, dá presença e comprime um pouco pra soar como locução
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af',
                    'highpass=f=90,equalizer=f=3000:t=q:w=1:g=3,acompressor=threshold=-20dB:ratio=3:attack=5:release=80',
                    '-ar', str(SR), '-ac', '1', path], check=True)
    return read_wav(path)


# ------------------------------ música ------------------------------

NOTE = {n: i for i, n in enumerate(['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'])}


def hz(name, octave):
    return 440.0 * 2 ** ((NOTE[name] + 12 * (octave + 1) - 69) / 12)


def lowpass(x, cutoff):
    b, a = butter(2, cutoff / (SR / 2), 'low')
    return lfilter(b, a, x)


def highpass(x, cutoff):
    b, a = butter(2, cutoff / (SR / 2), 'high')
    return lfilter(b, a, x)


def env(n, attack, release):
    e = np.ones(n)
    a = max(1, int(attack * SR))
    r = max(1, int(release * SR))
    e[:a] = np.linspace(0, 1, a)
    e[-r:] *= np.linspace(1, 0, r)
    return e


STYLES = {
    #               bpm   acordes (raiz, tipo)                                   kick           arpejo   brilho
    'Promo':       (92,  [('A', 'm7'), ('F', 'maj7'), ('C', 'maj7'), ('G', '6')], 'half',        True,    1800),
    'Reels':       (122, [('E', 'm7'), ('C', 'maj7'), ('G', 'maj7'), ('D', '6')], 'four',        True,    3200),
    'Clean':       (84,  [('D', 'maj7'), ('B', 'm7'), ('G', 'maj7'), ('A', '6')], 'soft',        True,    2400),
    'Noite':       (74,  [('F', 'maj7'), ('E', 'm7'), ('D', 'm7'), ('C', 'maj7')], 'soft',       True,    1400),
    'AntesDepois': (104, [('C', 'm7'), ('G#', 'maj7'), ('D#', 'maj7'), ('A#', '6')], 'half',     False,   2600),
}
CHORD = {'m7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11], '6': [0, 4, 7, 9]}


def music(style, seconds, seed=1):
    rng = np.random.default_rng(seed)
    bpm, prog, kick_mode, arp, bright = STYLES[style]
    beat = 60 / bpm
    n = int(seconds * SR)
    out = np.zeros(n)
    t_all = np.arange(n) / SR
    bar = beat * 4
    names = list(NOTE.keys())

    # pad: cada acorde dura 2 compassos
    chord_len = bar * 2
    k = 0
    pos = 0.0
    while pos < seconds:
        root, kind = prog[k % len(prog)]
        a = int(pos * SR)
        b = min(n, int((pos + chord_len) * SR))
        t = t_all[a:b] - pos
        seg = np.zeros(b - a)
        for semi in CHORD[kind]:
            idx = NOTE[root] + semi
            f = hz(names[idx % 12], 3 + idx // 12)
            for det in (-0.12, 0.12):
                ph = 2 * np.pi * f * (1 + det / 100) * t
                seg += (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.05  # serrote
        # baixo
        fb = hz(root, 2)
        seg += np.sin(2 * np.pi * fb * t) * 0.22
        seg *= env(b - a, 0.6, 0.6)
        out[a:b] += seg
        # arpejo em colcheias
        if arp:
            step = beat / 2
            notes = [NOTE[root] + s for s in CHORD[kind]] + [NOTE[root] + CHORD[kind][1] + 12]
            j = 0
            p = pos
            while p < min(seconds, pos + chord_len) - 0.01:
                idx = notes[[0, 2, 1, 3, 4, 3, 2, 1][j % 8]]
                f = hz(names[idx % 12], 5 + idx // 12)
                aa = int(p * SR)
                ln = min(n - aa, int(step * 1.8 * SR))
                tt = np.arange(ln) / SR
                note = (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(4 * np.pi * f * tt)) * np.exp(-tt * 7) * 0.06
                out[aa:aa + ln] += note
                p += step
                j += 1
        pos += chord_len
        k += 1
    out = lowpass(out, bright)

    # bateria
    drums = np.zeros(n)
    ducker = np.ones(n)
    beat_n = int(seconds / beat)
    for i in range(beat_n):
        t0 = i * beat
        a = int(t0 * SR)
        in_bar = i % 4
        kick = (kick_mode == 'four') or (kick_mode == 'half' and in_bar in (0, 2)) or (kick_mode == 'soft' and in_bar == 0)
        if kick:
            ln = min(n - a, int(0.35 * SR))
            tt = np.arange(ln) / SR
            f = 45 + 75 * np.exp(-tt * 30)
            drums[a:a + ln] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 9) * (0.55 if kick_mode != 'soft' else 0.35)
            dl = min(n - a, int(beat * 0.9 * SR))
            ducker[a:a + dl] = np.minimum(ducker[a:a + dl], 0.55 + 0.45 * (np.arange(dl) / dl) ** 0.6)
        if in_bar in (1, 3) and kick_mode != 'soft':
            ln = min(n - a, int(0.2 * SR))
            tt = np.arange(ln) / SR
            noise = rng.standard_normal(ln)
            drums[a:a + ln] += highpass(noise, 1500) * np.exp(-tt * 22) * 0.16
        # chimbal em colcheias
        for h in (0, 0.5):
            ah = int((t0 + h * beat) * SR)
            ln = min(n - ah, int(0.05 * SR))
            if ln <= 0:
                continue
            tt = np.arange(ln) / SR
            drums[ah:ah + ln] += highpass(rng.standard_normal(ln), 7000) * np.exp(-tt * 70) * (0.07 if h else 0.05)
    out = out * ducker + drums
    # fade de entrada e saída
    out *= env(n, 1.2, 2.5)
    out /= max(1e-6, np.abs(out).max())
    return out * 0.9


# ------------------------------ montagem ------------------------------

def build(video, cues):
    t = 0.0
    scenes = {}
    voice_track = []
    for i, cue in enumerate(cues):
        path = os.path.join(OUT, 'voz', f'{video}-{i:02d}-{cue["scene"]}.wav')
        v = voice(cue['text'], path)
        dur_v = len(v) / SR
        dur = max(cue['min'], LEAD + dur_v + TAIL)
        scenes[cue['scene']] = [round(t, 3), round(t + dur, 3)]
        voice_track.append((t + LEAD, v))
        print(f'  {video:12s} {cue["scene"]:10s} cena {dur:5.2f}s  fala {dur_v:5.2f}s')
        t += dur
    total = t + 0.2
    n = int(total * SR)
    vox = np.zeros(n)
    for start, v in voice_track:
        a = int(start * SR)
        vox[a:a + len(v)] += v[: n - a]
    vox /= max(1e-6, np.abs(vox).max())

    mus = music(video, total, seed=len(video))
    # ducking: a música abaixa enquanto tem voz
    env_v = np.abs(vox)
    win = int(0.25 * SR)
    env_v = np.convolve(env_v, np.ones(win) / win, mode='same')
    duck = 1 - 0.72 * np.clip(env_v / (env_v.max() * 0.25 + 1e-9), 0, 1)
    duck = np.convolve(duck, np.ones(win) / win, mode='same')
    mix = vox * 0.95 + mus * 0.32 * duck
    mix /= max(1e-6, np.abs(mix).max()) / 0.95
    raw = os.path.join(OUT, f'{video}.raw.wav')
    write_wav(raw, mix)
    # normaliza volume pra redes sociais (-14 LUFS)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), '-ac', '2',
                    os.path.join(OUT, f'{video}.wav')], check=True)
    return {'scenes': scenes, 'total': round(total, 3)}


if __name__ == '__main__':
    cues = json.load(open(os.path.join(HERE, 'narracao.json')))
    timings = {}
    for video, items in cues.items():
        timings[video] = build(video, items)
    json.dump(timings, open(os.path.join(HERE, '..', 'src', 'timings.json'), 'w'), indent=2, ensure_ascii=False)
    print('ok')
