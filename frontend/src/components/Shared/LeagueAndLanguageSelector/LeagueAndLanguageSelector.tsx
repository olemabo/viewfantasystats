import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import PublicIcon from '@mui/icons-material/Public';
import { FunctionComponent } from 'react';
import './LeagueAndLanguageSelector.scss';
import { Link } from 'react-router-dom';

type LeagueAndLanguageSelectorProps = {
    onclick(): void;
    text: string;
    url?: string;
}

export const LeagueSelector : FunctionComponent<LeagueAndLanguageSelectorProps> = (props) => {
    if (!props.url) {return null; }

    return <Link onClick={() => props.onclick()} to={props.url} className="button-with-icon">
    <div className="adjust-height">
        <SportsSoccerIcon fontSize="small" className="adjust-height" />
        <span className="adjust-height league">{props.text}</span>
    </div>
</Link>
};

export const LanguageSelector : FunctionComponent<LeagueAndLanguageSelectorProps> = (props) => {

    return <button onClick={() => props.onclick()} className="button-with-icon">
    <PublicIcon fontSize="small" className="adjust-height-lang"/>
    <span className="adjust-height-lang lang">
        {props.text}
    </span>
</button>
};
