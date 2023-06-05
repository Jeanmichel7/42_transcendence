import { UserInterface } from './UserTypes';

export interface SnackbarInterface {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
  vertical: 'top' | 'bottom';
  horizontal: 'left' | 'center' | 'right';
}

export interface PutSnackbarInterface {
  open?: boolean;
  message?: string;
  severity?: 'success' | 'info' | 'warning' | 'error';
  vertical?: 'top' | 'bottom';
  horizontal?: 'left' | 'center' | 'right';
}

export interface ReduxActionInterface {
  type: string;
  payload?: UserInterface | UserInterface[];
}