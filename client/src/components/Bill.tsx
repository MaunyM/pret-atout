import * as React from 'react';

import {Bill} from "../types";

interface IProps {
    bill : Bill
}

class BillComponent extends React.Component<IProps> {
  public render() {
      return (
          <div>
              <div>
                  {this.props.bill.name}
              </div>
          </div>
      )
  }
}

export default BillComponent;
