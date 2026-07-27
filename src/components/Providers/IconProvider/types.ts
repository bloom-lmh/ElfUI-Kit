import type { IconOptions, IconSet } from "../../Basic/Icon/types";

export interface IconProviderProps {
  options: IconOptions;
  defaultSet: string;
  aliases: Record<string, string>;
  sets: Record<string, IconSet>;
  inherit: boolean;
}
