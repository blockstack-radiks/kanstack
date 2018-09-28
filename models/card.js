import Model from 'radiks/lib/model';
import config from './config';

export default class Card extends Model {
  static config = config()

  static schema = {
    name: String,
    boardId: {
      type: String,
      decrypted: true,
    },
    status: String,
    order: {
      type: Number,
      decrypted: true,
    },
    description: String,
  }

  static defaults = {
    order: 0,
  }
}
