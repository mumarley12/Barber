"""Trilha alternativa (mais suave) do vídeo de 60s, com volume mais baixo."""
import os
import subprocess

from build_audio import OUT, SR, music, write_wav

mus = music('Sessenta2', 60.2, seed=96, drums_from=6.0, build=True) * 0.9
raw = os.path.join(OUT, 'Sessenta2.raw.wav')
write_wav(raw, mus)
# -21 LUFS: bem mais baixo que antes (-15), deixa espaço para narração por cima
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-af', 'loudnorm=I=-21:TP=-3:LRA=11', '-ar', str(SR), '-ac', '2',
                os.path.join(os.path.dirname(OUT), '..', 'public', 'audio', 'Sessenta.wav')], check=True)
print('ok')
