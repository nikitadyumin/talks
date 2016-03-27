import React from "react";

let HelloMessage = ({name}) =>  <div>Hello {name}!</div>;

React.render(<HelloMessage name="World" />, document.getElementById("app"));
