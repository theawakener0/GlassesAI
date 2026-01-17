/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

declare module '@expo/vector-icons' {
  import { ComponentType } from 'react';
  import { TextStyle, ViewStyle } from 'react-native';
  
  interface IconProps {
    name: string;
    size?: number;
    color?: string;
    style?: TextStyle | ViewStyle;
  }
  
  export const Ionicons: ComponentType<IconProps>;
  export const MaterialIcons: ComponentType<IconProps>;
  export const FontAwesome: ComponentType<IconProps>;
  export const Feather: ComponentType<IconProps>;
  export const AntDesign: ComponentType<IconProps>;
}

declare module '@react-native-community/slider' {
  import { ComponentType } from 'react';
  import { ViewStyle } from 'react-native';
  
  interface SliderProps {
    style?: ViewStyle;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    value?: number;
    onValueChange?: (value: number) => void;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    disabled?: boolean;
  }
  
  const Slider: ComponentType<SliderProps>;
  export default Slider;
}
