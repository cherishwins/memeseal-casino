# x402 is not used by this casino

This casino has no x402 code and takes no USDC. Its only payment code is the
Telegram Stars chip-purchase flow, which runs only when demo mode is off (see
`README.md`, "Demo / play-money only").

This file used to be an out-of-date copy of an old README from
`cherishwins/x402-facilitator`. That copy was wrong on two points:

- It called the facilitator production-deployed and used by several live apps.
  The hosted instance it linked to is not running.
- It described the operator running a facilitator that settles payments for
  other apps. The owner's x402 work rules that model out.

The maintained x402 code is merchant-side and lives in
[cherishwins/x402-facilitator](https://github.com/cherishwins/x402-facilitator).
Each merchant verifies payments made out to themselves and collects them on
their own server. Nobody runs a facilitator for anyone else. Check that
repository's README for its current status.
