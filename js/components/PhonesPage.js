import Component from '../Component.js';
import PhonesCatalog from './PhonesCatalog.js';
import PhoneViewer from './PhoneViewer.js';
import ShoppingCart from './ShoppingCart.js';
import Filter from './Filter.js';
import { getAll, getById } from '../api/phones.js';

export default class PhonesPage extends Component {
  constructor(element) {
    super(element);

    this.state = {
      phones: getAll().slice(0, 5),
      selectedPhone: null,
      items: {
        'qweqwe': 2,
        'dfsdfgdfg': 1,
      },
    };

    this.render();
  }

  addItem(item) {
    const oldItems = this.state.items;
    const items = {
      ...oldItems,
      [item]: oldItems[item] ? oldItems[item] + 1 : 1,
    };

    this.setState({ items: items });
  }

  removeItem(itemToRemove) {
    this.setState({
      items: this.state.items
        .filter(item => item !== itemToRemove)
    });
  }

  setSelectedPhone(phoneId) {
    this.setState({
      selectedPhone: getById(phoneId),
    });
  }

  init() {
    this.initComponent(PhonesCatalog, {
      phones: this.state.phones,
      onPhoneSelected: (phoneId) => this.setSelectedPhone(phoneId),
      onAdd: (phoneId) => this.addItem(phoneId),
    });

    this.initComponent(PhoneViewer, {
      phone: this.state.selectedPhone,
      onBack: () => this.setSelectedPhone(null),
      onAdd: (phoneId) => this.addItem(phoneId),
    });

    this.initComponent(ShoppingCart, {
      items: this.state.items,
      onRemove: (itemToRemove) => this.removeItem(itemToRemove)
    });

    this.initComponent(Filter);
  }

  render() {
    this.element.innerHTML = `
      <div class="row">

        <!--Sidebar-->
        <div class="col-md-2">
          <section>
            <div data-component="Filter"></div>
          </section>
  
          <section>
            <div data-component="ShoppingCart"></div>
          </section>
        </div>
  
        <!--Main content-->
        <div class="col-md-10">
          ${ this.state.selectedPhone ? `
            <div data-component="PhoneViewer"></div>
          ` : `
            <div data-component="PhonesCatalog"></div>
          `}
        </div>
      </div>
    `;

    this.init();
  }
}
