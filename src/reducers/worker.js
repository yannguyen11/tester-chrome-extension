import { actions } from '../constants';
import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';

const initialState = fromJS({
  state: 'inactive',
  // wantsMoreWork indicates that a working worker wants to continue to work
  // after the current job (it's only relevant for working workers).
  wantsMoreWork: false,
  uuid: null,
  workUrl: null,
  profileInfo: null,
  error: null,
});

const authenticate = (state, { payload }) => {
  if (!payload || !payload.workerUUID) {
    const err = new Error('AUTHENTICATE called without workerUUID parameter');
    return state.set('error', err);
  }

  return state.set('uuid', payload.workerUUID);
};

const updateWorkerState = (state, { payload: newState }) => {
  if (newState === 'working') {
    return state.merge({ state: newState, wantsMoreWork: true });
  }

  return state.set('state', newState);
};

const assignWork = (state, { payload: { url } }) => {
  const oldState = state.get('state');
  if (oldState !== 'ready') {
    const err = new Error(`Cannot assign work to worker in state '${oldState}'`);
    return state.set('error', err);
  }

  return state.merge({ state: 'working', wantsMoreWork: true, workUrl: url });
};

const workFinished = (state) => {
  if (state.get('state') === 'working') {
    const newState = state.get('wantsMoreWork') ? 'ready' : 'inactive';
    return state.merge({
      state: newState,
      workUrl: null,
      wantsMoreWork: false,
    });
  }

  return state;
};

const iconClicked = (state) => {
  switch (state.get('state')) {
    case 'ready':
      return state.set('state', 'inactive');
    case 'inactive':
      return state.set('state', 'ready');
    case 'working':
      return state.set('wantsMoreWork', !state.get('wantsMoreWork'));
    default:
      return state;
  }
};

const setWorkerProfile = (state, { payload }) => (
  state.set('profileInfo', fromJS(payload))
);

const worker = handleActions({
  [actions.AUTHENTICATE]: authenticate,
  [actions.UPDATE_WORKER_STATE]: updateWorkerState,
  [actions.ASSIGN_WORK]: assignWork,
  [actions.WORK_FINISHED]: workFinished,
  [actions.ICON_CLICKED]: iconClicked,
  [actions.SET_WORKER_PROFILE]: setWorkerProfile,
}, initialState);

export default worker;
