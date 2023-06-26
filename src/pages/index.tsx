import React, {useState, useRef, useEffect} from 'react';
import {Button, Row, Col, Radio, message, Checkbox, InputNumber, Divider} from 'antd';
import styles from './index.less';
import type {RadioChangeEvent} from 'antd';
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {useReactToPrint} from 'react-to-print';

export default () => {

    const [messageApi, contextHolder] = message.useMessage();

    const [range, setRange] = useState(10);
    const [fill, setFill] = useState(0);
    const [list, setList] = useState<JSX.Element[]>([]);
    const [equation, setEquation] = useState<CheckboxValueType[]>([]);
    const [totalPage, setTotalPage] = useState<number>(1);
    const printRef = useRef() as React.MutableRefObject<HTMLInputElement>;


    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    return (
        <div>
            {contextHolder}
            <Row>
                <Col className={styles.colJustify} span={6}>
                    <Radio.Group
                        options={[
                            {label: '10以内', value: 10},
                            {label: '20以内', value: 20},
                            {label: '50以内', value: 50},
                            {label: '100以内', value: 100},
                        ]}
                        onChange={({target: {value}}: RadioChangeEvent) => {
                            console.log('radio4 checked', value);
                            setRange(value);
                        }}
                        value={range}
                        optionType='button'
                        buttonStyle='solid'
                    />
                </Col>
                <Col className={styles.colJustify} span={6}>
                    <Radio.Group
                        options={[
                            {label: '不填空', value: 0},
                            {label: '填空', value: 1},
                        ]}
                        onChange={({target: {value}}: RadioChangeEvent) => {
                            setFill(value);
                        }}
                        value={fill}
                        optionType='button'
                        buttonStyle='solid'/>
                </Col>
                <Col className={styles.colJustify} span={6}>
                    <Checkbox.Group
                        style={{width: '100%'}}
                        onChange={(checkedValues: CheckboxValueType[]) => {
                            setEquation(checkedValues);
                        }}
                        options={[
                            {label: '加法', value: '+'},
                            {label: '减法', value: '-'},
                            {label: '乘法', value: '×'},
                            {label: '除法', value: '÷'},
                        ]}
                    />
                </Col>
                <Col className={styles.colJustify} span={2}>
                    <InputNumber
                        min={1}
                        max={10}
                        defaultValue={1}
                        // @ts-ignore
                        onChange={(value: number) => {
                            setTotalPage(value);
                        }}/>
                </Col>
                <Col className={styles.colJustify} span={2}><Button type='primary' onClick={() => {
                    const list = [];
                    if (equation.length === 0) {
                        messageApi.error('请选择算式', 0.5);
                        return;
                    }

                    // 循环生成单元格，包含随机算式
                    for (let i = 0; i < 100 * totalPage; i++) {
                        // 根据已选择算式随机生成算式符号
                        const rand = Math.round(Math.random() * (equation.length - 1));
                        if (i % 100 === 0) {
                            list.push(<Divider>口算练习题</Divider>);
                            list.push(<Col key='idx-name' className={styles.colTitle} span={6}>姓名：</Col>);
                            list.push(<Col key='idx-date' className={styles.colTitle} span={6}>日期：</Col>);
                            list.push(<Col key='idx-time' className={styles.colTitle} span={6}>用时：</Col>);
                            list.push(<Col key='idx-score' className={styles.colTitle} span={6}>得分：</Col>);
                        }

                        let num1 = Math.round(Math.random() * range);
                        let num2 = Math.round(Math.random() * range);
                        const equationMark = equation[rand];
                        // 减法需要判断两个数大小
                        if (equationMark === '-' && num1 < num2) {
                            let temp = num1;
                            num1 = num2;
                            num2 = temp;
                        }

                        list.push(<Col key={`idx-${i}`} className={styles.colSubject}
                                       span={6}>{`${num1} ${equationMark} ${num2} = `}</Col>);
                        if (i % 100 === 99) {
                            list.push(<Divider/>);
                        }
                    }

                    setList(list);
                }}>生成</Button></Col>
                <Col className={styles.colJustify} span={2}>

                    <Button type='primary' onClick={() => {
                        if (list.length === 0) {
                            messageApi.error('请先生成试题', 0.5);
                            return;
                        }
                        handlePrint();
                    }}>打印</Button>

                </Col>
            </Row>
            <Row ref={printRef}>
                {list.map((item) => item)}
            </Row>
        </div>
    );
}
