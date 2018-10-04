import Model from 'radiks/lib/model';

export default class Card extends Model {
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
