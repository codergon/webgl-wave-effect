import AutoBind from "auto-bind";
import Component from "../classes/Component";

export default class extends Component {
  constructor() {
    super({
      element: "body",
      elements: {},
    });

    AutoBind(this);
  }
}
