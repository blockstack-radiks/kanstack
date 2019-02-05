import { combineReducers } from 'redux';
import RadiksReducer from 'radiks/lib/redux/reducer';

import UserReducer from './user/reducer';
import BoardReducer from './board/reducer';

export default combineReducers({
  user: UserReducer,
  radiks: RadiksReducer,
  board: BoardReducer,
});
