"""Trilha do vídeo de 60s: começa só com o pad, a bateria entra aos 6s e cresce até o fim."""
import os
import subprocess

from build_audio import OUT, SR, music, write_wav

mus = music('Sessenta', 60.2, seed=60, drums_from=6.0, build=True) * 0.9
raw = os.path.join(OUT, 'Sessenta.raw.wav')
write_wav(raw, mus)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', str(SR), '-ac', '2',
                os.path.join(os.path.dirname(OUT), '..', 'public', 'audio', 'Sessenta.wav')], check=True)
print('ok')
