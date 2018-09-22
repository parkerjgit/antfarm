import React from 'react';

export default function Message (props) {

  const message = props.message;

  return (
    <li>
        <span>{ message.author.name }: { message.content }</span>
    </li>
  );
}
