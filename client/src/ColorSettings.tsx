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
    backgroundColor: '#c3c6ff',
    itemColor: '#e3e2ff'
  }
  
  export const ColorSettingsContext = createContext<ColorSettingsContextType>({
    colorSettings: defaultColorSettings,
    setColorSettings: () => {},
  });