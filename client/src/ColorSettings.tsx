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
    navColor: '#00C0FA',
    dateColor: '#aee9ff',
    backgroundColor: '#ADEBFB',
    itemColor: '#9ADCFF'
  }
  
  export const ColorSettingsContext = createContext<ColorSettingsContextType>({
    colorSettings: defaultColorSettings,
    setColorSettings: () => {},
  });