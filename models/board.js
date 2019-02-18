import Model from 'radiks/lib/model';
import Card from './card';

export default class Board extends Model {
  static className = 'Board';

  static schema = {
    name: String,
  }

  async afterFetch() {
    const { _id } = this;
    this.cards = await Card.fetchList({
      boardId: _id,
    }, {
      sort: ['order'],
    });
    return this;
  }
}
