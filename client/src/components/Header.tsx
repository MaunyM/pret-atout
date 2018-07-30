import * as React from 'react';
import {RouteComponentProps, withRouter} from "react-router";
import { Link } from 'react-router-dom';


class HeaderComponent extends React.Component<RouteComponentProps<{}>> {
  public render() {
      return (
          <header>
              <Link to="/">
                  Facturations
              </Link> |
              <Link to="/create" >
                  Création
              </Link>
          </header>
      )
  }
}

export default withRouter(HeaderComponent);
