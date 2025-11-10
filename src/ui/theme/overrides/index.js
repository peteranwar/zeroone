import merge from 'lodash/merge';
import Accordion from './accordion';
import Alert from './alert';
import Backdrop from './backdrop';
import Button from './button';
import Checkbox from './checkbox';
import Chip from './chip';
import Dialog from './dialog';
import DialogActions from './dialogActions';
import DialogContent from './dialogContent';
import DialogTitle from './dialogTitle';
import FormHelperText from './form-helper-text';
import Input from './input';
import LoadingButton from './loading-button';
import Radio from './radio';
import Select from './select';
import Snackbar from './snackbar';
import Typography from './typography';
import { cssBaseline } from './css-baseline';
import { cssBaselineEn } from './css-baseline-en';
import Menu from './menu';

/**
 * It merges all the overrides for all the components into one object
 * @param {Theme} theme - Theme - the theme object that is passed to the theme provider
 * @returns A function that takes a theme and returns a style object.
 */
export default function componentsOverrides(theme) {
  return merge(
    theme.direction === 'rtl' ? cssBaseline(theme) : cssBaselineEn(theme),
    Typography(theme),
    Button(theme),
    LoadingButton(theme),
    Input(theme),
    Backdrop(theme),
    Dialog(theme),
    DialogTitle(),
    DialogContent(theme),
    DialogActions(theme),
    Alert(theme),
    Snackbar(),
    Checkbox(theme),
    FormHelperText(),
    Chip(theme),
    Select(),
    Accordion(theme),
    Radio(theme),
    Menu(theme)
  );
}
