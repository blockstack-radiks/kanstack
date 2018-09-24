import { combineReducers } from 'redux';
import RadiksReducer from 'radiks/lib/redux/reducer';

import UserReducer from './user/reducer';

export default combineReducers({
  user: UserReducer,
  radiks: RadiksReducer,
});
