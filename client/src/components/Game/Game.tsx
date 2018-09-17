import * as React from 'react';

import ApolloClient from 'apollo-client';
import {withApollo} from "react-apollo";

import * as moment from 'moment';

import {Card, Header, Icon, Image, Label, List, Popup, SemanticCOLORS, Transition} from 'semantic-ui-react';

import { Game, Ludo, User} from "../../types";

import bggLogo from '../../img/bgg.png';
import GameMemberFooter from "./GameMemberFooter";
import GameOwnerFooter from "./GameOwnerFooter";

interface IProps {
    client: ApolloClient<any>;
    ludo: Ludo;
    me?: User;
    game: Game;
    onClick?: (g: Game) => void;
}

class GameComponent extends React.Component<IProps> {
    public render() {
        const {game, onClick, me, ludo, client} = this.props;
        const cardProp = onClick ? {onClick: this.cardClick} : {};
        this.cardClick = this.cardClick.bind(this);
        const colorProps = game.box && game.box.handle ? {color: "teal" as SemanticCOLORS} : {};
        return (
            <Transition transitionOnMount={true} duration={1000}>
                <Card {...cardProp} fluid={true} className={'Game'} {...colorProps}>
                    <Card.Content className={'card-content'}>
                        <Header className={'title'} as={'h4'}>
                            {game.name}
                            {game.box && game.box.borrow && <Header.Subheader>Disponible
                                le {moment.unix(game.box.borrow.end).format('D MMMM')}</Header.Subheader>}
                        </Header>
                        <div className={'card-column'}>
                            <List className={'info'}>
                                <List.Item>
                                    <Label color={'purple'}>
                                        <Icon name='users'/>
                                        <span>{game.minPlayer}</span> {game.minPlayer !== game.maxPlayer &&
                                    <span>- {game.maxPlayer}</span>}
                                    </Label>
                                </List.Item>
                                {!game.handle && <List.Item>
                                    <Popup trigger={<Image src={bggLogo} size={'mini'}/>}
                                           content='Trouvé sur BoardGameGeek !'/>
                                </List.Item>}
                            </List>
                            <Image src={game.thumbnail}/>
                        </div>
                        {me && ludo && ludo.handle && (
                            <div>
                                {ludo.edge === "OWNER" ?
                                    <GameOwnerFooter client={client} ludo={ludo} game={game}/>
                                    : <GameMemberFooter client={client} ludo={ludo} game={game}/>}
                            </div>)
                        }
                    </Card.Content>
                </Card>
            </Transition>
        )
    }

    public cardClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.game);
        }
    }
}

export default withApollo(GameComponent);
