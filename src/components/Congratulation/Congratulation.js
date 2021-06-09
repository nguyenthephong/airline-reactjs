import React from 'react';
import { Button, Form } from 'antd';
import 'antd/dist/antd.css';
import './Congratulation.css';

export default class Congratulation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onFinish = () => {
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="body">
                <div className="congratulationMsg">
                    <h1>
                        Payment Successfully!!!
                    </h1>
                    <div>
                        Thank you for purchasing the flight and enjoy your trip!
                    </div>
                </div>

                <div className="footer">
                    <Form.Item>
                        <Button type="primary" className="footerBtn" onClick={this.onFinish}> Home</Button>
                    </Form.Item>
                </div>
            </div>

        );
    }
}
