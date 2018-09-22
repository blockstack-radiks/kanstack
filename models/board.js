import Model from '../radiks/model';
import Card from './card';

export default class Board extends Model {
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
