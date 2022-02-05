import React, { Component } from "react";
import { render } from "react-dom";
import TopMenu from "./TopMenu";
import FixturePlanner from "./FixturePlanner";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ReactDOM from 'react-dom';

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//   }

//   render() {
//     return (
//       <div>
//           <TopMenu />
//           <Router>
//               <Routes>
//                   <Route path="/" element={<p>Front Page</p>}></Route>
//                   <Route path="/fixture-planner" element={<FixturePlanner />} />
//               </Routes>
//           </Router>
//       </div>
//     );
//   }
// }


function App() {
  return (
    <div>
        <TopMenu />
        <div className="showcase">
        </div>
        <div className="front-page-bottom">
            <div className="start-container">
              <div className="content-container">
                  <div className="col-sm-10 max-width">
                      <Router>
                          <Routes>
                            <Route path="/" element={<p>Front Page</p>}></Route>
                              <Route path="/fixture-planner" element={<FixturePlanner />} />
                          </Routes>
                      </Router>
                  </div>
              </div>
            </div>
        </div>
        <div className="footer">
          <p></p>
            <br />
            <br />
        </div>
    </div>
  );
}

export default App;


ReactDOM.render(
    <App />,
  document.getElementById('app')
);

// const appDiv = document.getElementById("app");
// render(<App />, appDiv);