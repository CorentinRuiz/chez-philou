import {Card, Statistic} from "antd";
import {Typography} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import {getColorDimmed} from "../../utils";

export const CardItem = (props) => {
    const {title, value, color = "#000000", prefix, suffix, subtitle} = props;
    return <Card loading={value === undefined} bordered={false} style={{backgroundColor: color !== "#000000" ? getColorDimmed(color) : "", height: "100%"}}>
        <div>
            <Statistic title={title} value={value} valueStyle={{color}} prefix={prefix}
                       suffix={<Typography variant="subtitle1">{suffix}</Typography>}/>
            <DisplaySubtitle subtitle={subtitle} color={color}/>
        </div>
    </Card>
}

const DisplaySubtitle = (props) => {
    const {subtitle, color} = props;
    if (subtitle !== undefined) {
        return <Typography color={color} variant="caption">{subtitle}</Typography>
    }
}

CardItem.propTypes = {
    title: PropTypes.string,
    value: PropTypes.string,
    color: PropTypes.string,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
    subtitle: PropTypes.string
}