import React from 'react';
import UserListItem from './userListItem';
import { Card, CardBody, Container, Text } from '@chakra-ui/react';

export default function UserList(props) {
  if (!props.items || props.items.length === 0) {
    return (
      <Card>
        <CardBody>
          <Text>Users not found</Text>
        </CardBody>
      </Card>
    );
  }

  return (
    <ul style={{ listStyleType: 'none', padding: 0 }}>
      {props.items.map((user) => (
        <Container maxW="12xl">
        <UserListItem
          key={user.id || user._id}
          id={user.id || user._id}
          places={user.places || []}
          firstname={user.firstname}
          lastname={user.lastname}
          email = {user.email}
          image = {user.image}
        />
        </Container>
      ))}
    </ul>
  );
}
