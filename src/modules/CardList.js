import {Card} from "./Card.js";

export class CardList {
    constructor(container, array) {
        this.container = container;
        this.array = array;
    }

    addCard(name, link, id) {
        const {cardElement} = new Card(name, link, id);
        this.container.appendChild(cardElement);
    }

    render() {
        this.array.forEach(function (item) {
            new Card(item.name, item.link, item.owner._id);
        });
    }
}


