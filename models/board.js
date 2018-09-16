import Model from '../radiks/model';
import Card from './card';

import BoardSchema from '../schemas/Board.json';

export default class Board extends Model {
  static schema = {
    name: String,
  }

  async afterFetch() {
    console.log('after fetch', this.attrs);
    const { id } = this;
    this.cards = await Card.fetchList({
      boardId: id,
    }, {
      sort: ['order'],
    });
    return this;
  }
}
