import React from 'react';
import { List, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { logoutUser } from '../../utils/authUser';
import { kemnakerIcon } from '../../public/images/Logo_Kemnaker.png'

function SideMenu({
  user: { unreadNotification, email, unreadMessage, username },
  pc = true,
}) {
  const router = useRouter();

  const isActive = (route) => router.pathname === route;

  return (
    <>
      <List
        style={{ paddingTop: '1rem' }}
        size="big"
        verticalAlign="middle"
        selection
      >
        <Image
          src={'/images/Logo_Kemnaker.png'}
          width={500}
          height={500}
          alt="Picture of the author"
        />
        <p style={{ textAlign: 'center', margin: 0 }} >BBPVP BEKASI</p>
        <p style={{ textAlign: 'center' }} >SOCIAL CLASS</p>
        <Link passHref href="/">
          <List.Item active={isActive('/')}>
            <Icon name="home" size="large" color={isActive('/') && 'teal'} />
            <List.Content>{pc && <List.Header content="Home" />}</List.Content>
          </List.Item>
        </Link>
        <br />

        {/* <Link passHref href="/messages"> */}
        <List.Item active={isActive('/messages')} as="a" href="/messages">
          <Icon
            name={unreadMessage ? 'hand point right' : 'mail outline'}
            size="large"
            color={
              (isActive('/messages') && 'teal') || (unreadMessage && 'orange')
            }
          />
          <List.Content>
            {pc && <List.Header content="Messages" />}
          </List.Content>
        </List.Item>
        {/* </Link> */}
        <br />

        <Link passHref href="/notifications">
          <List.Item active={isActive('/notifications')}>
            <Icon
              name={unreadNotification ? 'hand point right' : 'bell outline'}
              size="large"
              color={
                (isActive('/notifications') && 'teal') ||
                (unreadNotification && 'orange')
              }
            />
            <List.Content>
              {pc && <List.Header content="Notifications" />}
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link passHref href={`/${username}`}>
          <List.Item active={router.query.username === username}>
            <Icon
              name="user"
              size="large"
              color={router.query.username === username && 'teal'}
            />
            <List.Content>
              {pc && <List.Header content="Account" />}
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <List.Item onClick={() => logoutUser(email)}>
          <Icon name="log out" size="large" />
          <List.Content>{pc && <List.Header content="Logout" />}</List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default SideMenu;
