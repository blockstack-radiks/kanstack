import { combineReducers } from 'redux';
import UserReducer from './user/reducer';
import RadiksReducer from '../radiks/redux/reducer';

export default combineReducers({
  user: UserReducer,
  radiks: RadiksReducer,
});
