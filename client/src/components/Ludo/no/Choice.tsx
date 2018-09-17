import * as React from 'react';
import {Card, Icon} from "semantic-ui-react";

interface IProps {
    match?: {
        url: string
    },
    history: any
}

class LudoNochoiceComponent extends React.Component<IProps> {

    public render() {
        return (
            <Card.Group centered={true}>
                <Card onClick={this.toCreate}>
                    <Card.Content>
                        <Card.Header>
                            <Icon.Group size={'large'}>
                                <Icon name='warehouse'/>
                                <Icon corner={true} name='add' color={'teal'}/>
                            </Icon.Group>
                            Ouvrir
                        </Card.Header>
                        <Card.Description>
                            Pour gérer sa propre bibliothéque de jeux et pouvoir la partager.
                        </Card.Description>
                    </Card.Content>
                </Card>
                <Card onClick={this.toJoin}>
                    <Card.Content>
                        <Card.Header>
                            <Icon.Group size={'large'}>
                                <Icon name='warehouse'/>
                                <Icon corner={true} name='reply' color={'teal'}/>
                            </Icon.Group>
                            Rejoindre</Card.Header>
                        <Card.Description>
                            Pour rejoindre une communauté existante et pouvoir emprunter des jeux.
                        </Card.Description>
                    </Card.Content>
                </Card>
            </Card.Group>
        );
    }

    private toCreate = () => this.props.history.push('/home/ludo/create');
    private toJoin = () => this.props.history.push('/home/ludo/join');

}

export default LudoNochoiceComponent;
