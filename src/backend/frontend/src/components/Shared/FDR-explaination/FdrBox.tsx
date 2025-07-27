import { en, no, fpl, LeagueType } from '../../../models/shared/PageProps';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import React, { FunctionComponent } from 'react';
import './FdrBox.scss';


type FdrBoxProps = {
    leagueType?: LeagueType,
    fdrToColor?: any,
    content: any,
}

export const FdrBox : FunctionComponent<FdrBoxProps> = ({
    leagueType = fpl,
    fdrToColor,
    content,
}) => {

    return <>
    { leagueType === fpl ? <p className='diff-introduction-container'>
        { content.LongTexts.fdrValues } 
        <span className="diff-introduction-box diff-1">1</span>
        <span className="diff-introduction-box diff-2">2</span>
        <span className="diff-introduction-box diff-3">3</span>
        <span className="diff-introduction-box diff-4">4</span>
        <span className="diff-introduction-box diff-5">5</span>
        <span className="diff-introduction-box black">10</span>
    </p> : <>
        <p className='diff-introduction-container'>
            { content.LongTexts.fdrValues } 
            <span style={{ backgroundColor: "#1d3557bf" }} className="diff-introduction-box wide">0.25</span>
            <span style={{ backgroundColor: "#47abd89e" }} className="diff-introduction-box">1</span>
            <span style={{ backgroundColor: "#95d2ec8f" }} className="diff-introduction-box">2</span>
            <span style={{ backgroundColor: "#e7f9ff7a" }} className="diff-introduction-box">3</span>
            <span style={{ backgroundColor: "#ff4242a3" }} className="diff-introduction-box">4</span>
            <span style={{ backgroundColor: "#d01b1bb5" }} className="diff-introduction-box">5</span>
            <span style={{ backgroundColor: convertFDRtoHex("10", fdrToColor)}} className="diff-introduction-box black">10</span>
        </p>
        <p>{ content.LongTexts.fdrDescription } </p>
    </>
    }
    </>
};

export default FdrBox;
