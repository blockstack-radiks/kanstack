import Model from '../radiks/model';

// import CardSchema from '../schemas/Card.json';

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
