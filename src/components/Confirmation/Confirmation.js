import React from 'react';
import { Button, Row, Col, Form } from 'antd';
import * as flightService from '../../services/flightService';
import 'antd/dist/antd.css';
import './Confirmation.css';
// import moment from 'moment'

export default class Confirmation extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    onConfirm = () => {
        const {
            location: {
                state: selectedValues
            } } = this.props;

        var orderRequest = {
            timeOfOrder:new Date(),
            returnType: selectedValues.flightType,
            flight: selectedValues.selectedFlightInfo,
            totalPeople: selectedValues.totalPassenger,
            totalPrice: (selectedValues.totalPassenger*selectedValues.selectedFlightInfo.price)
        }

        flightService.submitOrder(orderRequest).then(response => {
            this.setState({ flightData: response });
        });
        this.props.history.push("/congratulation");
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        const {
            location: {
                state: selectedValues
            } } = this.props;

        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 6,
            },
        };

        return (
            <div className="body">
                <div className="bookingInfo">
                    <h1>
                        Booking information
                    </h1>
                    <div>
                        <Form {...layout}>
                            <Row>
                                <Col span={8}>
                                    <Form.Item label="Flight Type:">
                                        {selectedValues.flightTypeDescription}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Total passenger:">
                                        {selectedValues.totalPassenger}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item label="Adult:">
                                        {selectedValues.adultCount}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Senior:">
                                        {selectedValues.seniorCount}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Children:">
                                        {selectedValues.childCount}
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <Form.Item label="Flight Code:">
                                        {selectedValues.selectedFlightInfo ? selectedValues.selectedFlightInfo.id : ''}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item label="Flight Description:">
                                        {selectedValues.selectedFlightInfo ? selectedValues.selectedFlightInfo.description : ''}
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>

                <div className="footer">
                    <Button type="default" className="footerBtn" onClick={this.goBack}> Back</Button>
                    <Button type="primary" className="footerBtn" onClick={this.onConfirm}> Confirm</Button>
                </div>
            </div>

        );
    }
}
