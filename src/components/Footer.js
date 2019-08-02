import React from 'react';

function Footer(props) {
  // console.log( props.currentRoom )
  return (
    <div>
      <h1>{props.currentRoom.title}</h1>
    </div>
  );
}

export default Footer;