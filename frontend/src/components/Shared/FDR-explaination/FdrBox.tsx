import { fpl, LeagueType } from '../../../models/shared/PageProps';
import { convertFDRtoHex } from '../../../utils/convertFDRtoHex';
import React, { FunctionComponent } from 'react';
import './FdrBox.scss';


type FdrBoxProps = {
    leagueType?: LeagueType,
    fdrToColor?: any,
}

export const FdrBox : FunctionComponent<FdrBoxProps> = ({
    leagueType = fpl,
    fdrToColor
}) => {
    
    return <>
    { leagueType === fpl ? <p className='diff-introduction-container'>
        FDR verdier: 
        <span className="diff-introduction-box diff-1">1</span>
        <span className="diff-introduction-box diff-2">2</span>
        <span className="diff-introduction-box diff-3">3</span>
        <span className="diff-introduction-box diff-4">4</span>
        <span className="diff-introduction-box diff-5">5</span>
        <span className="diff-introduction-box black">10</span>
    </p> : <>
        <p className='diff-introduction-container'>
            FDR verdier: 
            <span style={{ backgroundColor: "#1d3557bf" }} className="diff-introduction-box wide">0.25</span>
            <span style={{ backgroundColor: "#47abd89e" }} className="diff-introduction-box">1</span>
            <span style={{ backgroundColor: "#95d2ec8f" }} className="diff-introduction-box">2</span>
            <span style={{ backgroundColor: "#e7f9ff7a" }} className="diff-introduction-box">3</span>
            <span style={{ backgroundColor: "#ff4242a3" }} className="diff-introduction-box">4</span>
            <span style={{ backgroundColor: "#d01b1bb5" }} className="diff-introduction-box">5</span>
            <span style={{ backgroundColor: convertFDRtoHex("10", fdrToColor)}} className="diff-introduction-box black">10</span>
        </p>
        <p>Mørkeblå bokser markerer en dobbeltrunde, mens svarte bokser markerer at laget ikke har kamp den runden.</p>
    </>
    }
    </>
};

export default FdrBox;
