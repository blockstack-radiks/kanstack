// import UserGroup from 'radiks/lib/models/user-group';
import { UserGroup } from 'radiks';

export default class Project extends UserGroup {
  static schema = {
    ...UserGroup.schema,
  }
  // static className = 'Project';
}
