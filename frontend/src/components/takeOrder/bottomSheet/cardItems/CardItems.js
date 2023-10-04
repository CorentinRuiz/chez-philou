import {Card, Statistic} from "antd";
import {Typography} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

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

const getColorDimmed = (color) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.05)`;
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
    color: PropTypes.bool,
    prefix: PropTypes.any,
    suffix: PropTypes.any,
    subtitle: PropTypes.string
}