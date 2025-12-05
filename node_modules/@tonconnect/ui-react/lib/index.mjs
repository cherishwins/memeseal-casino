var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { jsx } from "react/jsx-runtime";
import { createContext, memo, useContext, useCallback, useEffect, useState, useMemo } from "react";
import { TonConnectUI, TonConnectUIError, toUserFriendlyAddress, CHAIN } from "@tonconnect/ui";
export * from "@tonconnect/ui";
function isClientSide() {
  return typeof window !== "undefined";
}
function isServerSide() {
  return !isClientSide();
}
const TonConnectUIContext = createContext(null);
let tonConnectUI = null;
const TonConnectUIProvider = (_a) => {
  var _b = _a, {
    children
  } = _b, options = __objRest(_b, [
    "children"
  ]);
  if (isClientSide() && !tonConnectUI) {
    tonConnectUI = new TonConnectUI(options);
  }
  return /* @__PURE__ */ jsx(TonConnectUIContext.Provider, { value: tonConnectUI, children });
};
const TonConnectUIProvider$1 = memo(TonConnectUIProvider);
class TonConnectUIReactError extends TonConnectUIError {
  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, TonConnectUIReactError.prototype);
  }
}
class TonConnectProviderNotSetError extends TonConnectUIReactError {
  constructor(...args) {
    super(...args);
    Object.setPrototypeOf(this, TonConnectProviderNotSetError.prototype);
  }
}
function checkProvider(provider) {
  if (!provider) {
    throw new TonConnectProviderNotSetError(
      "You should add <TonConnectUIProvider> on the top of the app to use TonConnect"
    );
  }
  return true;
}
function useTonConnectUI() {
  const tonConnectUI2 = useContext(TonConnectUIContext);
  const setOptions = useCallback(
    (options) => {
      if (tonConnectUI2) {
        tonConnectUI2.uiOptions = options;
      }
    },
    [tonConnectUI2]
  );
  if (isServerSide()) {
    return [null, () => {
    }];
  }
  checkProvider(tonConnectUI2);
  return [tonConnectUI2, setOptions];
}
const buttonRootId = "ton-connect-button";
const TonConnectButton = ({ className, style }) => {
  const [_, setOptions] = useTonConnectUI();
  useEffect(() => {
    setOptions({ buttonRootId });
    return () => setOptions({ buttonRootId: null });
  }, [setOptions]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      id: buttonRootId,
      className,
      style: __spreadValues({ width: "fit-content" }, style)
    }
  );
};
const TonConnectButton$1 = memo(TonConnectButton);
function useTonWallet() {
  const [tonConnectUI2] = useTonConnectUI();
  const [wallet, setWallet] = useState(
    (tonConnectUI2 == null ? void 0 : tonConnectUI2.wallet) || null
  );
  useEffect(() => {
    if (tonConnectUI2) {
      setWallet(tonConnectUI2.wallet);
      return tonConnectUI2.onStatusChange((value) => {
        setWallet(value);
      });
    }
  }, [tonConnectUI2]);
  return wallet;
}
function useTonAddress(userFriendly = true) {
  const wallet = useTonWallet();
  return useMemo(() => {
    if (wallet) {
      return userFriendly ? toUserFriendlyAddress(
        wallet.account.address,
        wallet.account.chain === CHAIN.TESTNET
      ) : wallet.account.address;
    } else {
      return "";
    }
  }, [wallet, userFriendly, wallet == null ? void 0 : wallet.account.address, wallet == null ? void 0 : wallet.account.chain]);
}
function useTonConnectModal() {
  const [tonConnectUI2] = useTonConnectUI();
  const [state, setState] = useState((tonConnectUI2 == null ? void 0 : tonConnectUI2.modal.state) || null);
  useEffect(() => {
    if (tonConnectUI2) {
      setState(tonConnectUI2.modal.state);
      return tonConnectUI2.onModalStateChange((value) => {
        setState(value);
      });
    }
  }, [tonConnectUI2]);
  return {
    state,
    open: () => tonConnectUI2 == null ? void 0 : tonConnectUI2.modal.open(),
    close: () => tonConnectUI2 == null ? void 0 : tonConnectUI2.modal.close()
  };
}
function useIsConnectionRestored() {
  const [restored, setRestored] = useState(false);
  const [tonConnectUI2] = useTonConnectUI();
  useEffect(() => {
    if (tonConnectUI2) {
      tonConnectUI2.connectionRestored.then(() => setRestored(true));
    }
  }, [tonConnectUI2]);
  return restored;
}
export {
  TonConnectButton$1 as TonConnectButton,
  TonConnectProviderNotSetError,
  TonConnectUIContext,
  TonConnectUIProvider$1 as TonConnectUIProvider,
  TonConnectUIReactError,
  useIsConnectionRestored,
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
  useTonWallet
};
//# sourceMappingURL=index.mjs.map
