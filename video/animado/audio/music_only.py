"""Gera só a trilha instrumental (sem narração) de cada vídeo, com a duração de src/timings.json."""
import json
import os
import subprocess

from build_audio import HERE, OUT, SR, music, write_wav

timings = json.load(open(os.path.join(HERE, '..', 'src', 'timings.json')))
for video, t in timings.items():
    mus = music(video, t['total'], seed=len(video)) * 0.9
    raw = os.path.join(OUT, f'{video}.musica.raw.wav')
    write_wav(raw, mus)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', str(SR), '-ac', '2',
                    os.path.join(OUT, f'{video}.musica.wav')], check=True)
    print('ok', video)
