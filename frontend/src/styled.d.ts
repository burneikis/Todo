import 'styled-components';
import { Theme } from './context/ThemeContextDefinition';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}