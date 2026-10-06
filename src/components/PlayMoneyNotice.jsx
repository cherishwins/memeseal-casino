import { PLAY_MONEY_NOTICE } from '../themes'
import { DEMO_MODE } from '../config'

// Always on: outcomes are computed client-side, so chips can't carry real value.
const PlayMoneyNotice = () => (
  <div
    role="note"
    className="mt-2 mx-auto max-w-sm rounded-lg border border-casino-gold/60 bg-black/70 px-3 py-2"
  >
    <p className="font-casino text-xs font-bold uppercase tracking-wide text-casino-gold">
      <span aria-hidden="true">⚠ </span>
      {PLAY_MONEY_NOTICE.headline}
    </p>
    <p className="mt-0.5 text-[11px] text-matrix-green/70">
      {PLAY_MONEY_NOTICE.detail}
      {DEMO_MODE && ' Chips are stored on this device only.'}
    </p>
  </div>
)

export default PlayMoneyNotice
