// import App from 'next/app';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import baseUrl from '../utils/baseUrl';
import { redirectUser } from '../utils/authUser';
import Layout from '../components/Layout/Layout';
import 'react-toastify/dist/ReactToastify.css';
import 'semantic-ui-css/semantic.min.css';

// // ============== Class ==============
// class MyApp extends App {
//   static async getInitialProps({ Component, ctx }) {
//     const { token } = parseCookies(ctx);
//     console.log('token: ', token);
//     let pageProps = {};

//     const protectedRoutes = ctx.pathname === '/' || ctx.pathname === "/[username]";;
//     console.log('protectedRoutes:', protectedRoutes);

//     if (!token) {
//       protectedRoutes && redirectUser(ctx, '/login');
//     }
//     //
//     else {
//       if (Component.getInitialProps) {
//         pageProps = await Component.getInitialProps(ctx);
//       }

//       try {
//         const res = await axios.get(`${baseUrl}/api/auth`, {
//           headers: { Authorization: token },
//         });

//         const { user, userFollowStats } = res.data;

//         if (user) !protectedRoutes && redirectUser(ctx, '/');

//         pageProps.user = user;
//         pageProps.userFollowStats = userFollowStats;
//       } catch (error) {
//         destroyCookie(ctx, 'token');
//         redirectUser(ctx, '/login');
//       }
//     }

//     return { pageProps };
//   }

//   render() {
//     const { Component, pageProps } = this.props;

//     return (
//       <Layout {...pageProps}>
//         <Component {...pageProps} />
//       </Layout>
//     );
//   }
// }

// ============== Function ==============
function MyApp({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};

  const protectedRoutes =
    ctx.pathname === '/' ||
    ctx.pathname === '/[username]' ||
    ctx.pathname === '/notifications' ||
    ctx.pathname === '/post/[postId]' ||
    ctx.pathname === '/messages' ||
    ctx.pathname === '/search';

  if (!token) {
    protectedRoutes && redirectUser(ctx, '/login');
  }
  //
  else {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    try {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });

      const { user, userFollowStats } = res.data;

      if (user) !protectedRoutes && redirectUser(ctx, '/');

      pageProps.user = user;
      pageProps.userFollowStats = userFollowStats;
    } catch (error) {
      destroyCookie(ctx, 'token');
      redirectUser(ctx, '/login');
    }
  }

  return { pageProps };
};

export default MyApp;
