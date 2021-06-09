import React from 'react';
import { Select, DatePicker, Row, Col, Table, Button, Form, Input } from 'antd';
import moment from 'moment';
import * as flightService from '../../services/flightService';
import 'antd/dist/antd.css';
import './Home.css';

const { Option } = Select;
const { RangePicker } = DatePicker;

const initialState = {
    flightStations: [],
    flightTypes: [],
    flightData: [],
    flightTableColumns: [],
    selectedFlightType: '',
    selectedFlightInfo: null,
}

export default class Home extends React.Component {

    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.getFlightStations();
        this.getFlightTypes();
        this.getFlightTableColumns();
    }

    getFlightStations = () => {
        flightService.getFlightStations()
            .then(response => response.json())
            .then(response => {
                if (response) {
                    const stations = response.map(item => {
                        return {
                            key: item.id,
                            value: item.name
                        }
                    });
                    this.setState({ flightStations: stations });
                }
            });
    };

    getFlightTypes = () => {
        flightService.getFlightTypes().then(values => {
            this.setState({ flightTypes: values });
        });
    }

    getFlightTableColumns = () => {
        const columns = [
            {
                title: 'Flight Code',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Arrival Airport',
                dataIndex: 'arrAirportName',
                key: 'arrAirportName',
            },
            {
                title: 'Arrival Date',
                dataIndex: 'arrDate',
                key: 'arrDate',
            },
            {
                title: 'Arrival Time',
                dataIndex: 'arrTime',
                key: 'arrTime',
            },
            {
                title: 'Departure Airport',
                dataIndex: 'depAirportName',
                key: 'depAirportName',
            },
            {
                title: 'Departure Date',
                dataIndex: 'depDate',
                key: 'depDate',
            },
            {
                title: 'Departure Time',
                dataIndex: 'depTime',
                key: 'depTime',
            },
            {
                title: 'Ticket Price',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: 'Available Tickets',
                dataIndex: 'availableTickets',
                key: 'availableTickets',
            },
        ];
        this.setState({ flightTableColumns: columns });
    }

    buildSearchCriteria = (data) => {
        let searchCriteria = {
            // flightType: data.flightType,
            fromDate: data.fromDate,
            toDate: data.toDate,
            fromStation: data.fromStation,
            toStation: data.toStation,
            totalTickets: data.totalPassenger
        }
        return searchCriteria;
    }

    searchFlight = () => {
        const { current: form } = this.formRef;
        const values = form.getFieldsValue();
        const commitData = this.manipulateData(values);
        const searchCriteria = this.buildSearchCriteria(commitData);
        flightService.searchFlight(searchCriteria)
        .then (response => response.json())
        .then(response => {
            if (Array.isArray(response)) {
                response.forEach(function (arrayItem) {
                    arrayItem["key"] = arrayItem.id;
                    arrayItem["arrAirportName"] = arrayItem.arrAirport.name;
                    arrayItem["depAirportName"] = arrayItem.depAirport.name;
                });
                this.setState({ flightData: response });
            }
        });
    }

    manipulateData = (values) => {
        const { flightStations = [], flightTypes = [], selectedFlightInfo } = this.state;

        let commitData = {};
        if (values.flightType === 'One-Way' && values.departureDate) {
            const fromDate = moment(values.departureDate).format('DD-MM-YYYY');
            commitData.fromDate = fromDate;
        }
        if (values.flightType === 'Round-Trip' && values.roundTripTime) {
            commitData.fromDate = moment(values.roundTripTime[0]).format('DD-MM-YYYY');
            commitData.toDate = moment(values.roundTripTime[1]).format('DD-MM-YYYY');
        }
        if (values.flightType) {
            commitData.flightType = values.flightType;
            commitData.flightTypeDescription = flightTypes.find(ele => ele.key = values.flightType).value;
        }
        if (values.fromStation) {
            commitData.fromStation = values.fromStation;
            commitData.fromStationDescription = flightStations.find(ele => ele.key = values.fromStation).value;
        }
        if (values.toStation) {
            commitData.toStation = values.toStation;
            commitData.toStationDescription = flightStations.find(ele => ele.key = values.toStation).value;
        }
        commitData.adultCount = Number(values.adults);
        commitData.totalPassenger = commitData.adultCount;
        if (values.seniors) {
            commitData.seniorCount = Number(values.seniors);
            commitData.totalPassenger += Number(values.seniors);
        }
        if (values.children) {
            commitData.childCount = Number(values.children);
            commitData.totalPassenger += commitData.childCount;
        }
        commitData.selectedFlightInfo = selectedFlightInfo;

        return commitData;
    }

    onFlightTypeChange = (value) => {
        this.setState({ selectedFlightType: value });
    }

    onSubmit = (values) => {
        const commitData = this.manipulateData(values);
        this.props.history.push("/confirmation", commitData);
    }

    onFlightSelect = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedFlightInfo: selectedRows[0] });
    }

    render() {
        const { flightStations = [], flightTypes = [], flightData = [], flightTableColumns = [], selectedFlightType } = this.state;

        const layout = {
            labelCol: {
                span: 6,
            },
            wrapperCol: {
                span: 16,
            },
        };

        const rowSelection = {
            type: 'radio',
            onChange: this.onFlightSelect
        }

        return (
            <div className="body">
                <Form {...layout} ref={this.formRef} onFinish={this.onSubmit} initialValues={
                    {
                        flightType: 'One-Way',
                        adults: 1,
                        seniors: 0,
                        children: 0
                    }
                }>
                    <div className="flightInfo">
                        <Row gutter={36}>
                            <Col span={8}>
                                <Form.Item name="flightType" label="Flight Type:" rules={[
                                    {
                                        required: true,
                                        message: 'Please select type!',
                                    },
                                ]}>
                                    <Select placeholder="Type" className="select" onChange={this.onFlightTypeChange}>
                                        {flightTypes.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                {
                                    selectedFlightType === 'RoundTrip' ?
                                        <Form.Item name="roundTripTime" label="Round Trip Time:">
                                            <RangePicker format='DD-MM-YYYY' className="fullWidth" />
                                        </Form.Item>
                                        :
                                        <Form.Item name="departureDate" label="Departure Date:">
                                            <DatePicker format='DD-MM-YYYY' className="fullWidth" />
                                        </Form.Item>
                                }
                            </Col>
                        </Row>
                        <Row gutter={36}>
                            <Col span={8}>
                                <Form.Item name="fromStation" label="From Station:">
                                    <Select placeholder="From" className="select" rules={[
                                        {
                                            required: true,
                                            message: 'Please select departure station!',
                                        },
                                    ]}>
                                        {flightStations.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="toStation" label="To Station:">
                                    <Select placeholder="To" className="select" rules={[
                                        {
                                            required: true,
                                            message: 'Please select destination description!',
                                        },
                                    ]}>
                                        {flightStations.map(item => <Option key={item.key} value={item.key}>{item.value}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={36}>
                            <Col span={8}>
                                <Form.Item name="adults" label="Adults:" rules={[
                                    {
                                        required: true,
                                        message: 'Please select at least 1 adult!',
                                    },
                                ]}>
                                    <Input type="number"></Input>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="seniors" label="Seniors:">
                                    <Input type="number"></Input>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="children" label="Children:">
                                    <Input type="number"></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Button type="primary" className="searchBtn" onClick={this.searchFlight}> Search flights</Button>
                        <Table rowSelection={rowSelection} dataSource={flightData} columns={flightTableColumns} />
                    </div>
                    <div className="footer">
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="footerBtn"> Submit</Button>
                        </Form.Item>
                    </div>
                </Form>
            </div >
        );
    }
}
