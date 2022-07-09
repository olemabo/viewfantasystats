import React, { FunctionComponent } from 'react';
import './Spinner.scss';

type CheckBoxProps = {
}

export const Spinner : FunctionComponent<CheckBoxProps> = (props) => {

    return <div id="spinner-box" className="boxs">
    <div className="shadow"></div>
    <div className="gravity">
        <div className="ball"></div>
    </div>
  </div>
};

export default Spinner;


Spinner.defaultProps = {
}