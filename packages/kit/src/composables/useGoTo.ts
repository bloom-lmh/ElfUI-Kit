import { useConfigProvider } from "../components/Providers/config";
import { goTo, type GoTo, type GoToOptions } from "./goTo";

const definedOptions = (options: GoToOptions): GoToOptions =>
  Object.fromEntries(
    Object.entries(options).filter(([, value]) => value !== undefined),
  ) as GoToOptions;

export const useGoTo = (): GoTo => {
  const provider = useConfigProvider();
  return (target, options = {}) =>
    goTo(target, {
      ...(provider.config.goTo ?? {}),
      ...definedOptions(options),
      reducedMotion: options.reducedMotion ?? provider.reducedMotion,
    });
};
