import { createAction } from 'redux-actions';
import { actions } from '../constants';

export const assignWork = createAction(actions.ASSIGN_WORK);
export const authenticate = createAction(actions.AUTHENTICATE);
export const connect = createAction(actions.CONNECT);
export const logMessage = createAction(actions.LOG_MESSAGE);
export const connectionClosed = createAction(actions.CONNECTION_CLOSED);
export const authFailed = createAction(actions.AUTH_FAILED);
export const iconClicked = createAction(actions.ICON_CLICKED);
export const workFinished = createAction(actions.WORK_FINISHED);
export const setPluginVersion = createAction(actions.SET_PLUGIN_VERSION);

const validWorkerStates = ['ready', 'inactive', 'working'];

export const updateWorkerState = state => {
  if (!validWorkerStates.includes(state)) {
    throw new Error(`Unrecognized worker state: '${state}'`);
  }

  return {
    type: actions.UPDATE_WORKER_STATE,
    payload: state,
  };
};

export default {
  assignWork,
  authenticate,
  connect,
  logMessage,
  connectionClosed,
  authFailed,
  iconClicked,
  workFinished,
  setPluginVersion,
};