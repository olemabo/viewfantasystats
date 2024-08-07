import { RotationPlannerTeamInfoModel } from '../../../models/fixturePlanning/RotationPlannerTeamInfo';
import { DefaultPageContainer } from '../../Layout/DefaultPageContainer/DefaultPageContainer';
import { ShowRotationData } from '../../Fixtures/ShowRotationData/ShowRotationData';
import { KickOffTimesModel } from '../../../models/fixturePlanning/KickOffTimes';
import { TeamCheckedModel } from '../../../models/fixturePlanning/TeamChecked';
import React, { useState, useEffect, FunctionComponent } from 'react';
import axios from 'axios';
import './LeagueFrontPage.scss';
import { LeagueType, esf, fpl } from '../../../models/shared/PageProps';

interface MostOwnedPlayersModel {
    goalkeeper_list: any[];
    defender_list: any[];
    midtfielder_list: any[];
    forward_list: any[];
}

interface RankAndPointsModel {
    rank: number;
    points: number;
    points_from_first: number;
}

type FrontPageProps = {
    languageContent: any;
    leagueType: LeagueType;
}

export const FrontPage : FunctionComponent<FrontPageProps> = (props) => {
    const rank_points_api_path = "/statistics/rank-and-points-api/";
    const most_owned_api_path = "/statistics/most-owned-team/";
    
    const empty: RankAndPointsModel[] = [];
    const emptyMostOwnedPlayers: MostOwnedPlayersModel = { goalkeeper_list: [], defender_list: [], midtfielder_list: [], forward_list: [] };


    const [ currentGw, setCurrentGw ] = useState(-1);
    const [ rankAndPointsData, setRanksAndPointsData ] = useState(empty); 

    const [ mostOwnedPlayersData, setMostOwnedPlayersData ] = useState(emptyMostOwnedPlayers);

    useEffect(() => {        
        let temp_RankAndPoints: RankAndPointsModel[] = [];        
        axios.get(rank_points_api_path).then(x => {
            if (x.data) {
                let data = JSON.parse(x.data);
                data?.rank_and_points_list?.forEach( (rank_and_point: any[]) => {
                    if (rank_and_point.length == 3)
                        temp_RankAndPoints.push({rank: rank_and_point[0], points: rank_and_point[1], points_from_first: rank_and_point[2] });
                })
                setRanksAndPointsData(temp_RankAndPoints)
            }
        })

        axios.get(most_owned_api_path + "?league_name=" + props.leagueType).then(x => {
            if (x.data) {
                let data = JSON.parse(x.data);
                setCurrentGw(data?.gw);
                setMostOwnedPlayersData({
                    goalkeeper_list: data?.goalkeeper_list,
                    defender_list: data?.defender_list,
                    midtfielder_list: data?.midtfielder_list,
                    forward_list: data?.forward_list,
                })
            }
        })

    }, [props?.leagueType]);

    function getTeamShirtImgSrcUrl(num: number) {
        if (props.leagueType == esf) {
            if (num == 1) return team_id_to_img_shirt_url_eliteserien[1];
            if (num == 3) return team_id_to_img_shirt_url_eliteserien[3];
            if (num == 4) return team_id_to_img_shirt_url_eliteserien[4];
            if (num == 5) return team_id_to_img_shirt_url_eliteserien[5];
            if (num == 6) return team_id_to_img_shirt_url_eliteserien[6];
            if (num == 7) return team_id_to_img_shirt_url_eliteserien[7];
            if (num == 8) return team_id_to_img_shirt_url_eliteserien[8];
            if (num == 9) return team_id_to_img_shirt_url_eliteserien[9];
            if (num == 10) return team_id_to_img_shirt_url_eliteserien[10];
            if (num == 13) return team_id_to_img_shirt_url_eliteserien[13];
            if (num == 14) return team_id_to_img_shirt_url_eliteserien[14];
            if (num == 15) return team_id_to_img_shirt_url_eliteserien[15];
            if (num == 17) return team_id_to_img_shirt_url_eliteserien[17];
            if (num == 19) return team_id_to_img_shirt_url_eliteserien[19];
            if (num == 20) return team_id_to_img_shirt_url_eliteserien[20];
            if (num == 25) return team_id_to_img_shirt_url_eliteserien[25];
            return "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_0_1-66.webp";
        }
        if (props.leagueType == fpl) {
            if (num == 1) return team_id_to_img_shirt_url_premier_league[1];
            if (num == 2) return team_id_to_img_shirt_url_premier_league[2];
            if (num == 3) return team_id_to_img_shirt_url_premier_league[3];
            if (num == 4) return team_id_to_img_shirt_url_premier_league[4];
            if (num == 5) return team_id_to_img_shirt_url_premier_league[5];
            if (num == 6) return team_id_to_img_shirt_url_premier_league[6];
            if (num == 7) return team_id_to_img_shirt_url_premier_league[7];
            if (num == 8) return team_id_to_img_shirt_url_premier_league[8];
            if (num == 9) return team_id_to_img_shirt_url_premier_league[9];
            if (num == 10) return team_id_to_img_shirt_url_premier_league[10];
            if (num == 11) return team_id_to_img_shirt_url_premier_league[11];
            if (num == 12) return team_id_to_img_shirt_url_premier_league[12];
            if (num == 13) return team_id_to_img_shirt_url_premier_league[13];
            if (num == 14) return team_id_to_img_shirt_url_premier_league[14];
            if (num == 15) return team_id_to_img_shirt_url_premier_league[15];
            if (num == 16) return team_id_to_img_shirt_url_premier_league[16];
            if (num == 17) return team_id_to_img_shirt_url_premier_league[17];
            if (num == 18) return team_id_to_img_shirt_url_premier_league[18];
            if (num == 19) return team_id_to_img_shirt_url_premier_league[19];
            if (num == 20) return team_id_to_img_shirt_url_premier_league[20];
            return "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0-66.webp";
        }

        return "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_0_1-66.webp";
    }

    const team_id_to_img_shirt_url_eliteserien = {
        1: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_2744-66.webp",
        3: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_3376-110.png",
        4: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_3835-66.webp",
        5: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_305-66.webp",
        6: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_203-66.webp",
        7: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_307-66.webp",
        8: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_197-66.webp",
        9: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_312-66.webp",
        10: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_2997-66.webp",
        13: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_2364-66.webp",
        14: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_310-66.webp",
        15: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_311-66.webp",
        17: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_3334-66.webp",
        19: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_2745-66.webp",
        20: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_2251-66.webp",
        25: "https://fantasy.tv2.no/dist/img/shirts/standard/shirt_5592-66.webp",
      };
    
      const team_id_to_img_shirt_url_premier_league = {
        1: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_3-66.webp",
        2: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_7-66.webp",
        3: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_91-66.webp",
        4: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_94-66.webp",
        5: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_36-66.webp",
        6: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_8-66.webp",
        7: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_31-66.webp",
        8: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_11-66.webp",
        9: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_54-66.webp",
        10: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_2-66.webp",
        11: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_13-66.webp",
        12: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_14-66.webp",
        13: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_43-66.webp",
        14: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_1-66.webp",
        15: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_4-66.webp",
        16: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_17-66.webp",
        17: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_20-66.webp",
        18: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_6-66.webp",
        19: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_21-66.webp",
        20: "https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_39-66.webp",
      };

    return <>
    <DefaultPageContainer leagueType={props.leagueType} pageClassName='front-page-container' heading={props.languageContent.Fixture?.RotationPlanner?.title} description={props.languageContent?.Fixture?.RotationPlanner?.title}>
        { currentGw > 0 && <h1>{props.languageContent.General?.gw} {currentGw}</h1>}
        <h2> {props.languageContent?.Statistics?.PlayerOwnership?.title} (EO) {props.languageContent?.General?.top} {props.leagueType == fpl ? "10000" : "1000"} </h2>
        <div className='most-owned-players'>
            <div className='position-container'>
                {mostOwnedPlayersData.forward_list?.map( (x: any[]) => 
                <div className='player-container'>
                    <img src={getTeamShirtImgSrcUrl(x[1])}></img>
                    {/* <div>{x[3] + " (" + x[4].toFixed(1) + " %)"}</div> */}
                    <div>{x[3]}</div>
                    <div>{" (" + x[4].toFixed(1) + " %)"}</div>   
                </div> 
                )}
            </div>
            <div className='position-container'>
                {mostOwnedPlayersData.midtfielder_list?.map( (x: any[]) => 
                    <div className='player-container'>
                        <img src={getTeamShirtImgSrcUrl(x[1])}></img>
                        {/* <div>{x[3] + " (" + x[4].toFixed(1) + " %)"}</div>    */}
                        <div>{x[3]}</div>
                        <div>{" (" + x[4].toFixed(1) + " %)"}</div>
                    </div>    
                )}
            </div>
            <div className='position-container'>
                {mostOwnedPlayersData.defender_list?.map( (x: any[]) => 
                    <div className='player-container'>
                        <img src={getTeamShirtImgSrcUrl(x[1])}></img>
                        <div>{x[3]}</div>
                        <div>{" (" + x[4].toFixed(1) + " %)"}</div>   
                    </div>     
                )}
            </div>
            <div className='position-container'>
                {mostOwnedPlayersData.goalkeeper_list?.map( (x: any[]) => 
                    <div className='player-container'>
                        <img src={getTeamShirtImgSrcUrl(x[1])}></img>
                        {/* <div>{x[3] + " (" + x[4].toFixed(1) + " %)"}</div>    */}
                        <div>{x[3]}</div>
                        <div>{" (" + x[4].toFixed(1) + " %)"}</div>
                    </div>    
                )}
            </div>
         </div>
         {/* { rankAndPointsData?.length > 0 &&
            <table>
                <thead>
                    <tr>
                        <th>{props.languageContent.General.ranking}</th>
                        <th>{props.languageContent.General.points}</th>
                        <th>{props.languageContent.General.points_away_from_first}</th>
                    </tr>
                </thead>
                <tbody>
                    { rankAndPointsData.map(x => 
                        <tr>
                            <td>{x.rank}</td>
                            <td>{x.points}</td>
                            <td>{x.points_from_first}</td>
                        </tr>
                    )}
                </tbody>
            </table>
         } */}
    </DefaultPageContainer>
    </>
};

export default FrontPage;
