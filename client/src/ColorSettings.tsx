import { createContext } from "react";

export interface ColorSettings {
    navColor: string
    dateColor: string
    backgroundColor: string
    itemColor: string
  }
  
  export interface ColorSettingsContextType {
    colorSettings: ColorSettings;
    setColorSettings: (colorSettings: Partial<ColorSettings>) => void;
  }
  
  export const defaultColorSettings: ColorSettings = {
    navColor: '#b191ff',
    dateColor: '#d4c3ff',
    backgroundColor: '#d7d9ff',
    itemColor: '#bcbaff'
  }
  
  export const ColorSettingsContext = createContext<ColorSettingsContextType>({
    colorSettings: defaultColorSettings,
    setColorSettings: () => {},
  });