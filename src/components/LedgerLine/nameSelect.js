import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

export default class  extends Component {

    state = {
        filtered : [],
        value: 0,
    }

    componentWillMount(){
        const { names } = this.props;

        const convertNamesToArray = names.all.map((id)=>{
            return names[id];
        });

        this.setState( { filtered : convertNamesToArray });

    }

    handleChange = (value)=>{
        this.setState({ value });
    }



    render() {
        const { filtered } = this.state;
        console.log(filtered);
        return (
            <Select
            showSearch
             style={{width: '300px'}}
             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
                {
                    filtered.map((master)=>{
                        return(
                            <Option key={master.cust_id+master.name} value={master.cust_id}>
                            {master.name}</Option>
                        )
                    })
                }
            </Select>
        );
    }
}

