import React from 'react';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';

function Index({ user, userFollowStats }) {
  console.log({ user, userFollowStats });
  return <div>HomePage</div>;
}

// export async function getStaticProps(context) {
//   const res = await fetch(`https://jsonplaceholder.typicode.com/posts`);
//   const data = await res.json();

//   return {
//     props: { data }, // will be passed to the page component as props
//   };
// }

export default Index;
