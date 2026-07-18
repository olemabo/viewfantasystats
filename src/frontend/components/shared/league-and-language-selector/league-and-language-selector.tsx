"use client"

import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PublicIcon from '@mui/icons-material/Public';
import { FunctionComponent } from 'react';
import './league-and-language-selector.css';
import Link from 'next/link';

type LeagueAndLanguageSelectorProps = {
    text: string;
    url?: string;
}

export const LeagueSelector : FunctionComponent<LeagueAndLanguageSelectorProps> = (props) => {
    if (!props.url) {return null; }

    return <Link href={props.url} className="button-with-icon">
    <div className="adjust-height">
        <SportsSoccerIcon fontSize="small" className="adjust-height" />
        <span className="adjust-height league">{props.text}</span>
    </div>
</Link>
};

export const LanguageSelector : FunctionComponent<LeagueAndLanguageSelectorProps> = (props) => {

    return <button className="button-with-icon">
    <PublicIcon fontSize="small" className="adjust-height-lang"/>
    <span className="adjust-height-lang lang">
        {props.text}
    </span>
</button>
};
