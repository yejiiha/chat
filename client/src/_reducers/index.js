import { combineReducers } from 'redux';
import user from './user_reducer';
import chat from './chat_reducers';

const rootReducer = combineReducers({
    user,
    chat
});

export default rootReducer;