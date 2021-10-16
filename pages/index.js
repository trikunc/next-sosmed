import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import baseUrl from '../utils/baseUrl';
import CreatePost from '../components/Post/CreatePost';
import CardPost from '../components/Post/CardPost';
import { Segment } from 'semantic-ui-react';
import { parseCookies } from 'nookies';
import { NoPosts } from '../components/Layout/NoData';
import { PostDeleteToastr } from '../components/Layout/Toastr';
import InfiniteScroll from 'react-infinite-scroll-component';
import {
  PlaceHolderPosts,
  EndMessage,
} from '../components/Layout/PlaceHolderGroup';
import cookie from 'js-cookie';
import getUserInfo from '../utils/getUserInfo';
import MessageNotificationModal from '../components/Home/MessageNotificationModal';
import newMsgSound from '../utils/newMsgSound';
import {
  LikeNotification,
  CommentNotification,
} from '../components/Home/NotificationPortal';

function Home({ user, postsData, errorLoading }) {
  const [posts, setPosts] = useState(postsData || []);
  const [showToastr, setShowToastr] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [pageNumber, setPageNumber] = useState(2);

  const socket = useRef();
  const [newMessageReceived, setNewMessageReceived] = useState(null);
  const [newMessageModal, showNewMessageModal] = useState(false);
  const [newLikeNotification, setNewLikeNotification] = useState(null);
  const [newCommentNotification, setNewCommentNotification] = useState(null);
  const [notificationPopup, showNotificationPopup] = useState(false);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io(baseUrl);
    }
    if (socket.current) {
      socket.current.emit('join', { userId: user._id });
      socket.current.on('newMsgReceived', async ({ newMsg }) => {
        const { name, profilePicUrl } = await getUserInfo(newMsg.sender);
        if (user.newMessagePopup) {
          setNewMessageReceived({
            ...newMsg,
            senderName: name,
            senderProfilePic: profilePicUrl,
          });
          showNewMessageModal(true);
        }
        newMsgSound(name);
      });
    }
    document.title = `Welcome, ${user.name.split(' ')[0]}`;
    return () => {
      if (socket.current) {
        // socket.current.emit('disconnect');
        socket.current.off();
      }
    };
  }, []);

  useEffect(() => {
    showToastr && setTimeout(() => setShowToastr(false), 3000);
  }, [showToastr]);

  const fetchDataOnScroll = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/posts`, {
        headers: { Authorization: cookie.get('token') },
        params: { pageNumber },
      });

      if (res.data.length === 0) setHasMore(false);

      setPosts((prev) => [...prev, ...res.data]);
      setPageNumber((prev) => prev + 1);
    } catch (error) {
      alert('Error fetching Posts!!!');
    }
  };

  if (posts.length === 0 || errorLoading) return <NoPosts />;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (socket.current) {
      socket.current.on(
        'newNotificationReceived',
        ({ name, profilePicUrl, username, postId }) => {
          setNewLikeNotification({ name, profilePicUrl, username, postId });
          showNotificationPopup(true);
        }
      );
      socket.current.on(
        'newNotifCommentReceived',
        ({ name, profilePicUrl, username, postId, text }) => {
          setNewCommentNotification({
            name,
            profilePicUrl,
            username,
            postId,
            text,
          });
          showNotificationPopup(true);
        }
      );
    }
  }, []);

  return (
    <>
      {notificationPopup && newLikeNotification !== null && (
        <LikeNotification
          newNotification={newLikeNotification}
          notificationPopup={notificationPopup}
          showNotificationPopup={showNotificationPopup}
        />
      )}
      {notificationPopup && newCommentNotification !== null && (
        <CommentNotification
          newNotification={newCommentNotification}
          notificationPopup={notificationPopup}
          showNotificationPopup={showNotificationPopup}
        />
      )}

      {showToastr && <PostDeleteToastr />}

      {newMessageModal && newMessageReceived !== null && (
        <MessageNotificationModal
          socket={socket}
          showNewMessageModal={showNewMessageModal}
          newMessageModal={newMessageModal}
          newMessageReceived={newMessageReceived}
          user={user}
        />
      )}

      <Segment>
        <CreatePost user={user} setPosts={setPosts} />

        <InfiniteScroll
          hasMore={hasMore}
          next={fetchDataOnScroll}
          loader={<PlaceHolderPosts />}
          endMessage={<EndMessage />}
          dataLength={posts.length}
        >
          {posts.map((post) => (
            <CardPost
              socket={socket}
              key={post._id}
              post={post}
              user={user}
              setPosts={setPosts}
              setShowToastr={setShowToastr}
            />
          ))}
        </InfiniteScroll>
      </Segment>
    </>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const { token } = parseCookies(ctx);

    const res = await axios.get(`${baseUrl}/api/posts`, {
      headers: { Authorization: token },
      params: { pageNumber: 1 },
    });

    return { props: { postsData: res.data } };
  } catch (error) {
    return { props: { errorLoading: true } };
  }
}

export default Home;
