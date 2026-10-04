import { Composition } from 'remotion'
import { AntesDepois, ANTES_DEPOIS_FRAMES } from './AntesDepois'
import { Clean, CLEAN_FRAMES } from './Clean'
import { Noite, NOITE_FRAMES } from './Noite'
import { Promo, PROMO_FRAMES } from './Promo'
import { Reels, REELS_FRAMES } from './Reels'
import { Sessenta, SESSENTA_FRAMES } from './Sessenta'

const size = { fps: 30, width: 1080, height: 1920 }

export const Root = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} {...size} />
    <Composition id="Reels" component={Reels} durationInFrames={REELS_FRAMES} {...size} />
    <Composition id="Clean" component={Clean} durationInFrames={CLEAN_FRAMES} {...size} />
    <Composition id="Noite" component={Noite} durationInFrames={NOITE_FRAMES} {...size} />
    <Composition id="Sessenta" component={Sessenta} durationInFrames={SESSENTA_FRAMES} {...size} />
    <Composition id="AntesDepois" component={AntesDepois} durationInFrames={ANTES_DEPOIS_FRAMES} {...size} />
  </>
)
