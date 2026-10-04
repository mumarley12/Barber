import { Composition } from 'remotion'
import { Clean, CLEAN_FRAMES } from './Clean'
import { Promo, PROMO_FRAMES } from './Promo'
import { Reels, REELS_FRAMES } from './Reels'

export const Root = () => (
  <>
    <Composition id="Promo" component={Promo} durationInFrames={PROMO_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Reels" component={Reels} durationInFrames={REELS_FRAMES} fps={30} width={1080} height={1920} />
    <Composition id="Clean" component={Clean} durationInFrames={CLEAN_FRAMES} fps={30} width={1080} height={1920} />
  </>
)
