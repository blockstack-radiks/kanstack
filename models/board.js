import Model from 'radiks/lib/model';
import config from './config';
import Card from './card';

export default class Board extends Model {
  static config = config()

  static schema = {
    name: String,
  }

  async afterFetch() {
    const { id } = this;
    this.cards = await Card.fetchList({
      boardId: id,
    }, {
      sort: ['order'],
    });
    return this;
  }
}
