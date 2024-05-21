import { FunctionComponent } from 'react';
import './Spinner.scss';

export const Spinner : FunctionComponent = () => {

    return (
      <div id="spinner-box" className="boxs">
        <div className="shadow"></div>
          <div className="gravity">
            <div className="ball"></div>
        </div>  
      </div>
    ) 
};

export default Spinner;